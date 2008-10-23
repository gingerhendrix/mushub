
begin 

  namespace :nginx do

    remote_task :push do
      rsync "conf/mushub/mushub.nginx.conf", "/tmp"
    end
  
    desc "Install nginx conf"
    remote_task :deploy => :push do
      run "sudo cp -r -f /tmp/mushub.nginx.conf /etc/nginx/sites-available"
      run "sudo ln -s -f /etc/nginx/sites-available/mushub.nginx.conf /etc/nginx/sites-enabled"
    end
    
    desc "Restart nginx"
    remote_task :restart do
      run "sudo /etc/init.d/nginx restart"
    end 
  
  end
end

