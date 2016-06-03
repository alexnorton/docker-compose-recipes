require 'sinatra'
require 'statsd-ruby'
require_relative 'api_client'
require_relative 'renderer_client'

class App < Sinatra::Base
  def initialize
    @api_client = APIClient.new
    @renderer_client = RendererClient.new
    @statsd = Statsd.new(
      ENV['METRICS_PORT_8125_UDP_ADDR'],
      ENV['METRICS_PORT_8125_UDP_PORT']
    )
    super
  end

  after do
    @statsd.increment "frontend.status.#{status}"
  end

  not_found do
    erb :error_404
  end

  get '/' do
    @recipes = @api_client.recipes
    erb :index
  end

  get '/:recipe' do
    @recipe = @api_client.recipe(params['recipe'])
    halt 404 unless @recipe.code == 200
    @rendered_recipe = @renderer_client.render @recipe
    erb :recipe
  end
end
