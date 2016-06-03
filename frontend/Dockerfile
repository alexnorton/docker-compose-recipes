FROM ruby

RUN mkdir -p /app
WORKDIR /app

ADD Gemfile /app/Gemfile

RUN bundle install

EXPOSE 3000

CMD ["rackup", "-p", "3000", "-o", "0.0.0.0"]
