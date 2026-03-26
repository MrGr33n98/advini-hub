# Migration to add user reference to lawyers
class AddUserRefToLawyers < ActiveRecord::Migration[7.0]
  def change
    add_reference :lawyers, :user, null: true, foreign_key: true
  end
end