# frozen_string_literal: true

require 'sinatra'

class DB
  attr_reader :path, :db

  def initialize(path: './hail_the_queen.json')
    @path = path
    File.write(path, { count: 0 }.to_json) unless File.exist?(path)
    @db = JSON.parse(File.read(path))
  end

  def count
    db['count']
  end

  def increment_count
    db['count'] += 1
    write!
    to_json
  end

  def to_json
    db.to_json
  end

  def write!
    File.write(path, db.to_json)
  end
end

$db = DB.new
$connections = []

class App < Sinatra::Base
  get '/' do
    send_file File.join(settings.public_folder, 'index.html')
  end

  get '/db' do
    content_type :json
    $db.to_json
  end

  post '/increment' do
    content_type :json
    $connections.each do |out|
      out << "data: foobar \n\n"
    end
    $db.increment_count
  end

  get '/subscribe' do
    content_type 'text/event-stream'
    stream(:keep_open) do |out|
      $connections << out
      out.callback { $connections.delete(out) }
    end
  end
end
