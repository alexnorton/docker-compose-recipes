require 'httparty'

class APIClient
  include HTTParty

  base_uri "#{ENV['API_PORT_3000_TCP_ADDR']}:#{ENV['API_PORT_3000_TCP_PORT']}"

  def recipes
    self.class.get('/recipes')
  end

  def recipe(id)
    self.class.get('/recipes/' + id)
  end
end
