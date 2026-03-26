# terraform/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "advocaciahub-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "advocaciahub-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "advocaciahub-vpc"
    Environment = var.environment
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "advocaciahub-public-subnet-${count.index}"
    Environment = var.environment
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 10}.0/24"
  availability_zone       = var.availability_zones[count.index]

  tags = {
    Name = "advocaciahub-private-subnet-${count.index}"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "advocaciahub-igw"
    Environment = var.environment
  }
}

# Route Table for Public Subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "advocaciahub-public-route-table"
    Environment = var.environment
  }
}

# Route Table Association for Public Subnets
resource "aws_route_table_association" "public" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# NAT Gateway for Private Subnets
resource "aws_eip" "nat" {
  count    = length(var.availability_zones)
  domain   = "vpc"
  vpc      = true

  tags = {
    Name = "advocaciahub-nat-eip-${count.index}"
    Environment = var.environment
  }
}

resource "aws_nat_gateway" "main" {
  count         = length(var.availability_zones)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name = "advocaciahub-nat-gateway-${count.index}"
    Environment = var.environment
  }

  depends_on = [aws_internet_gateway.main]
}

# Route Table for Private Subnets
resource "aws_route_table" "private" {
  count  = length(var.availability_zones)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = {
    Name = "advocaciahub-private-route-table-${count.index}"
    Environment = var.environment
  }
}

# Route Table Association for Private Subnets
resource "aws_route_table_association" "private" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "advocaciahub-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "advocaciahub-ecs-cluster"
    Environment = var.environment
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "advocaciahub-rds-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "advocaciahub-rds-subnet-group"
    Environment = var.environment
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier             = "advocaciahub-db"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "13.7"
  instance_class         = var.db_instance_class
  db_name                = "advocaciahub"
  username               = var.db_username
  password               = var.db_password
  parameter_group_name   = "default.postgres13"
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true
  backup_retention_period = 7
  backup_window         = "03:00-04:00"
  maintenance_window    = "sun:04:00-sun:05:00"

  tags = {
    Name = "advocaciahub-rds-instance"
    Environment = var.environment
  }
}

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name       = "advocaciahub-redis-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "advocaciahub-redis-subnet-group"
    Environment = var.environment
  }
}

# ElastiCache Cluster
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "advocaciahub-redis"
  description               = "Redis cluster for advocaciahub"
  node_type                 = var.redis_node_type
  port                      = 6379
  parameter_group_name      = "default.redis7"
  num_cache_clusters        = 1
  subnet_group_name         = aws_elasticache_subnet_group.main.name
  security_group_ids        = [aws_security_group.redis.id]
  at_rest_encryption_enabled = true
  transit_encryption_enabled = false

  tags = {
    Name = "advocaciahub-redis-cluster"
    Environment = var.environment
  }
}

# Security Groups
resource "aws_security_group" "alb" {
  name_prefix = "advocaciahub-alb-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "advocaciahub-alb-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "ecs_tasks" {
  name_prefix = "advocaciahub-ecs-tasks-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "advocaciahub-ecs-tasks-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name_prefix = "advocaciahub-rds-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "advocaciahub-rds-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "redis" {
  name_prefix = "advocaciahub-redis-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "advocaciahub-redis-sg"
    Environment = var.environment
  }
}

# ECR Repositories
resource "aws_ecr_repository" "frontend" {
  name                 = "advocaciahub-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
  }

  tags = {
    Name = "advocaciahub-frontend-ecr"
    Environment = var.environment
  }
}

resource "aws_ecr_repository" "backend" {
  name                 = "advocaciahub-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
  }

  tags = {
    Name = "advocaciahub-backend-ecr"
    Environment = var.environment
  }
}

# ALB
resource "aws_lb" "main" {
  name               = "advocaciahub-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Name = "advocaciahub-alb"
    Environment = var.environment
  }
}

# ALB Target Groups
resource "aws_lb_target_group" "frontend" {
  name     = "advocaciahub-frontend-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/"
    matcher             = "200"
  }

  tags = {
    Name = "advocaciahub-frontend-tg"
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "backend" {
  name     = "advocaciahub-backend-tg"
  port     = 3001
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/api/health"
    matcher             = "200"
  }

  tags = {
    Name = "advocaciahub-backend-tg"
    Environment = var.environment
  }
}

# ALB Listeners
resource "aws_lb_listener" "frontend" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener" "backend" {
  load_balancer_arn = aws_lb.main.arn
  port              = "3001"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

# ECS Task Definitions
resource "aws_ecs_task_definition" "frontend" {
  family                   = "advocaciahub-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.frontend_cpu
  memory                   = var.frontend_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "frontend"
      image = "${aws_ecr_repository.frontend.repository_url}:latest"
      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "API_URL"
          value = "http://${aws_lb.main.dns_name}:3001/api/v1"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.app.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "frontend"
        }
      }
    }
  ])

  tags = {
    Name = "advocaciahub-frontend-task"
    Environment = var.environment
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "advocaciahub-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${aws_ecr_repository.backend.repository_url}:latest"
      portMappings = [
        {
          containerPort = 3001
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "RAILS_ENV"
          value = var.environment
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/advocaciahub"
        },
        {
          name  = "REDIS_URL"
          value = "redis://${aws_elasticache_replication_group.redis.primary_endpoint_address}:6379/0"
        }
      ]
      secrets = [
        {
          name      = "SECRET_KEY_BASE"
          valueFrom = "${aws_secretsmanager_secret.rails_secrets.arn}:SECRET_KEY_BASE::"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.app.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "backend"
        }
      }
    }
  ])

  tags = {
    Name = "advocaciahub-backend-task"
    Environment = var.environment
  }
}

# ECS Services
resource "aws_ecs_service" "frontend" {
  name            = "advocaciahub-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = var.frontend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private[*].id
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 80
  }

  tags = {
    Name = "advocaciahub-frontend-service"
    Environment = var.environment
  }

  depends_on = [aws_lb_listener.frontend]
}

resource "aws_ecs_service" "backend" {
  name            = "advocaciahub-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private[*].id
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3001
  }

  tags = {
    Name = "advocaciahub-backend-service"
    Environment = var.environment
  }

  depends_on = [aws_lb_listener.backend]
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/advocaciahub-app"
  retention_in_days = 14

  tags = {
    Name = "advocaciahub-log-group"
    Environment = var.environment
  }
}

# Secrets Manager for Rails secrets
resource "aws_secretsmanager_secret" "rails_secrets" {
  name = "advocaciahub/rails/secrets"

  tags = {
    Name = "advocaciahub-rails-secrets"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "rails_secrets_version" {
  secret_id     = aws_secretsmanager_secret.rails_secrets.id
  secret_string = jsonencode({
    SECRET_KEY_BASE = random_password.secret_key_base.result
  })
}

# Random password for Rails
resource "random_password" "secret_key_base" {
  length  = 128
  special = true
}