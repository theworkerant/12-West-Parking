class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def index
    render :jqtouch
  end
  
  def sencha
  end
  
  def jo
  end
  
  def jqtouch
  end
end