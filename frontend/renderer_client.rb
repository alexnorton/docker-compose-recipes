require 'httparty'

class RendererClient
  include HTTParty

  base_uri "#{ENV['RENDERER_PORT_3000_TCP_ADDR']}:#{ENV['RENDERER_PORT_3000_TCP_PORT']}"

  def render(recipe)
    self.class.post('/render',
      :body    => recipe.to_json, 
      :headers => { 'Content-Type' => 'application/json' }
    )
  end
end
