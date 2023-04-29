#!/usr/bin/env bash

# exit on error
set -o errexit

sudo yum install git postgresql15 postgresql-devel nodejs nginx augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip

sudo yum install dirmngr --allowerasing
gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable
source /home/ec2-user/.rvm/scripts/rvm
rvm install ruby-3.1.1

npm run build
bundle install
# rails db:create db:migrate db:seed
rails db:prepare
sudo /home/ec2-user/.rvm/gems/ruby-3.1.1/wrappers/rails s