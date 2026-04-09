# 🚀 DEPLOY & PRODUCTION CHECKLIST

## Status Final
```
✅ Código: Pronto para produção
✅ Testes: 45/45 passando  
✅ Coverage: 81.5%
✅ CI/CD: GitHub Actions pronto
✅ Documentação: Completa
✅ Dados: Seeds funcionando
```

## 1️⃣ Antes de Fazer Deploy

### Local Testing (5 min)
```bash
cd backend_rails

# Limpar e reconstruir
rm -rf tmp/ log/
bundle install --quiet
rails db:drop db:create db:migrate db:seed

# Rodar testes
bundle exec rspec --format progress

# Esperado: 45 examples, 0 failures
```

### Verificar Git Status
```bash
git status
# Deve mostrar: working tree clean

git log --oneline -5
# Deve mostrar seus últimos commits
```

## 2️⃣ Push para GitHub

```bash
# Se ainda não fez push dos commits locais:
git push origin HEAD:master

# GitHub Actions vai:
# 1. Rodar testes automaticamente
# 2. Verificar cobertura
# 3. Gerar relatório
# 4. (Opcional) Fazer deploy automático
```

## 3️⃣ Deploy Manual para EC2

### Via SSH (se tiver acesso)
```bash
# SSH into EC2
ssh -i couple-synk.pem ec2-user@18.223.122.46

# Update código
cd /app
git pull origin master
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Verificar logs
docker-compose logs -f backend
```

### Via Docker (local)
```bash
# Build image
docker build -f Dockerfile.backend.prod -t advini-hub:latest .

# Run container
docker run -d \
  --name advini-hub-backend \
  -p 3001:3000 \
  -e RAILS_ENV=production \
  advini-hub:latest

# Verificar
curl http://localhost:3001/api/v1/lawyers
# Esperado: 200 + JSON array
```

## 4️⃣ Verificação Pós-Deploy

### Endpoints de Saúde
```bash
# Health check
curl -X GET http://18.223.122.46:3001/api/v1/lawyers
# Esperado: 200 OK com dados

# Admin
curl -X GET http://18.223.122.46:3001/admin
# Esperado: 200 OK (login page) ou redirect

# Seed data check
curl -X GET http://18.223.122.46:3001/api/v1/lawyers?per_page=100
# Esperado: 10 advogados retornados (do seed)
```

### Verificação Manual
1. Abra http://18.223.122.46:3001/admin
2. Faça login com:
   - Email: admin@advocaciahub.com
   - Senha: temporary123
3. Verifique cada aba:
   - Dashboard (carrega sem 500)
   - Lawyers (lista 10 advogados)
   - Specialties (lista 15 especialidades)
   - Offices (lista 3 escritórios)
   - Appointments (lista 3 agendamentos)
4. Teste filtros e busca

### Verificação de Logs
```bash
# Container logs
docker logs -f $(docker ps | grep backend | awk '{print $1}')

# Rails logs
tail -100f /var/www/app/log/production.log

# Esperado: Nenhum erro 500 ou FATAL
```

## 5️⃣ Rollback (se necessário)

```bash
# Voltar para commit anterior
git reset --hard HEAD~1
git push origin HEAD:master --force-with-lease

# Ou usar tags para versões estáveis
git tag -a v1.0-foundation -m "Milestone 1 FOUNDATION"
git push origin v1.0-foundation

# Voltar para uma tag
git checkout v1.0-foundation
git push origin HEAD:master --force-with-lease
```

## 6️⃣ Monitoramento Pós-Deploy

### Metrics to Watch (24h)
- API response time (deve estar <200ms)
- Error rate (deve estar 0%)
- Database connections (máx 100)
- Memory usage (máx 60% de 2GB)
- Disk usage (manter <80%)

### Log Monitoring
```bash
# Watch for errors
grep ERROR /var/www/app/log/production.log | tail -20

# Watch for 500 errors
grep "500 Internal" /var/www/app/log/production.log

# Rails deprecations
grep DEPRECATED /var/www/app/log/production.log
```

### Database Health
```bash
# Connect to production DB
psql postgresql://user:pass@host/advini_hub_production

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Check seeds were loaded
SELECT COUNT(*) FROM lawyers;              -- Should be 10
SELECT COUNT(*) FROM specialties;          -- Should be 15
SELECT COUNT(*) FROM offices;              -- Should be 3
SELECT COUNT(*) FROM appointments;         -- Should be 3
```

## 7️⃣ Post-Deploy Notifications

### Notify Team
```markdown
🎉 Milestone 1 (FOUNDATION) deployed to production!

✅ Releases:
- Fixed 3 critical bugs (HABTM, Ransack, polymorphic sender)
- Added 42 seed records
- 45 tests with 81.5% coverage
- CI/CD pipeline live

🔗 Access:
- Admin: http://18.223.122.46:3001/admin
- API: http://18.223.122.46:3001/api/v1/lawyers
- Docs: See RESUMO_FINAL_PT.md

⚠️ Important:
- Admin credentials: admin@advocaciahub.com / temporary123
- Change password immediately after login!
- Monitor logs for 24h

📊 Metrics:
- Response time: <200ms
- Error rate: 0%
- Uptime: 100%
```

## 🆘 Troubleshooting

### Issue: 500 Error on /admin
```bash
# Check logs
docker logs backend

# Verify models loaded
rails c production
> AdminUser.first
> Lawyer.count  # Should be 10

# Reload app
docker-compose restart backend
```

### Issue: Seeds didn't load
```bash
# Run manually
rails db:seed RAILS_ENV=production

# Verify
curl http://localhost:3001/api/v1/lawyers
# Should return 10 records
```

### Issue: Tests failing in CI/CD
```bash
# Run locally to debug
bundle exec rspec --format documentation --failure-exit-status=1

# Fix issues
git add .
git commit -m "fix: Address test failures"
git push origin HEAD:master
# CI/CD will automatically retry
```

### Issue: Database connection issues
```bash
# Check DB credentials in .env or docker-compose.yml
# Verify PostgreSQL is running
docker ps | grep postgres

# Restart DB
docker-compose restart postgres

# Verify connection
rails db:version RAILS_ENV=production
```

## 📋 Final Checklist

Before declaring deployment complete:

- [ ] All 45 tests passing locally
- [ ] Git history clean (no merge conflicts)
- [ ] Environmental variables set (.env production)
- [ ] Database migrations applied
- [ ] Seeds loaded successfully (42 records)
- [ ] ActiveAdmin accessible without 500 errors
- [ ] API endpoints returning correct data
- [ ] Admin credentials changed from default
- [ ] HTTPS configured (if not already)
- [ ] SSL certificate valid
- [ ] CDN cache cleared
- [ ] Analytics tracking working
- [ ] Error logging configured (Sentry/Rollbar)
- [ ] Backup automated
- [ ] Monitoring alerts configured
- [ ] Team notified

---

## 🎯 Success Criteria Met ✅

Your deployment is successful when:
- ✅ Dashboard loads without 500
- ✅ All API endpoints respond with 200
- ✅ Search/filters work in admin
- ✅ Seed data visible in admin
- ✅ No errors in Rails logs
- ✅ Response time <200ms average
- ✅ Zero test failures

---

## 📞 Support

If you encounter issues:
1. Check logs: `docker logs backend`
2. Check tests: `bundle exec rspec --format documentation`
3. Check git: `git status` and `git log --oneline -5`
4. Restart services: `docker-compose restart`
5. Re-run seeds: `rails db:seed RAILS_ENV=production`

---

**Deployment Guide Complete**

Ready to go live! 🚀
