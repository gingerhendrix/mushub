
namespace :dist do

  desc "Builds the distribution"
  task :js do
    require 'protodoc'
    require 'fileutils'
   
    Dir.chdir(JS_SRC_DIR) do
      File.open(File.join(JS_SRC_DIR, "Mushub.js"), 'w+') do |dist|
        dist << Protodoc::Preprocessor.new("Mushub.js.erb")
      end
    end
  end
  
end
