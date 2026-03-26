# Appointments Controller
class Api::V1::AppointmentsController < ApplicationController
  before_action :authenticate_user!
  
  def index
    if current_user.admin?
      @appointments = Appointment.all
    elsif current_user.lawyer?
      # Find the lawyer profile for this user
      lawyer = Lawyer.find_by(user_id: current_user.id)
      @appointments = Appointment.by_lawyer(lawyer.id) if lawyer
    else
      @appointments = Appointment.where(client: current_user)
    end
    
    # Apply filters
    if params[:status].present?
      @appointments = @appointments.by_status(params[:status])
    end
    
    if params[:start_date].present?
      @appointments = @appointments.where('appointment_date >= ?', params[:start_date])
    end
    
    if params[:end_date].present?
      @appointments = @appointments.where('appointment_date <= ?', params[:end_date])
    end
    
    @appointments = @appointments.order(appointment_date: :asc)
    
    render json: {
      data: @appointments.map { |apt| appointment_json(apt) },
      total: @appointments.count
    }
  end

  def create
    @appointment = Appointment.new(appointment_params)
    
    # Associate with current user if client
    if current_user.client?
      @appointment.client = current_user
    elsif current_user.lawyer?
      # Lawyers can only schedule for their own appointments
      lawyer = Lawyer.find_by(user_id: current_user.id)
      unless lawyer && lawyer.id == @appointment.lawyer_id
        return render json: { error: 'Unauthorized to schedule for this lawyer' }, status: :forbidden
      end
    end
    
    if @appointment.save
      # Schedule notification
      AppointmentConfirmationJob.perform_later(@appointment)
      
      render json: appointment_json(@appointment), status: :created
    else
      render json: { 
        error: 'Failed to create appointment', 
        messages: @appointment.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def show
    @appointment = Appointment.find(params[:id])
    
    # Check authorization
    unless authorized_for_appointment?(@appointment)
      return render json: { error: 'Unauthorized' }, status: :forbidden
    end
    
    render json: appointment_json(@appointment)
  end

  def update
    @appointment = Appointment.find(params[:id])
    
    # Check authorization
    unless authorized_for_appointment?(@appointment)
      return render json: { error: 'Unauthorized' }, status: :forbidden
    end
    
    if @appointment.update(appointment_params)
      # Trigger notification if status changed
      if appointment_params[:status].present?
        AppointmentStatusChangeJob.perform_later(@appointment)
      end
      
      render json: appointment_json(@appointment)
    else
      render json: { 
        error: 'Failed to update appointment', 
        messages: @appointment.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @appointment = Appointment.find(params[:id])
    
    # Check authorization
    unless authorized_for_appointment?(@appointment)
      return render json: { error: 'Unauthorized' }, status: :forbidden
    end
    
    @appointment.destroy
    head :no_content
  end

  private

  def appointment_params
    params.require(:appointment).permit(
      :lawyer_id, :client_name, :client_email, :client_phone, 
      :appointment_date, :notes, :service_type, :appointment_type, 
      :status, :fee_amount, :meeting_link, :office_id
    )
  end

  def appointment_json(appointment)
    {
      id: appointment.id,
      lawyer_id: appointment.lawyer_id,
      client_id: appointment.client_id,
      office_id: appointment.office_id,
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      client_phone: appointment.client_phone,
      appointment_date: appointment.appointment_date,
      notes: appointment.notes,
      service_type: appointment.service_type,
      appointment_type: appointment.appointment_type,
      status: appointment.status,
      fee_amount: appointment.fee_amount,
      meeting_link: appointment.meeting_link,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at
    }
  end
  
  def authorized_for_appointment?(appointment)
    current_user.admin? || 
    (current_user.lawyer? && appointment.lawyer.user_id == current_user.id) ||
    (current_user.client? && appointment.client == current_user)
  end
end