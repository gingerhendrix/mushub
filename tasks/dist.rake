
namespace :dist do

  desc "Builds the distribution js file"
  task :js do
    require 'protodoc'
    require 'fileutils'
   
    Dir.chdir(JS_SRC_DIR) do
      File.open(File.join(JS_SRC_DIR, "Mushub.js"), 'w+') do |dist|
        dist << Protodoc::Preprocessor.new("Mushub.js.erb")
      end
    end
  end
  
  desc "Builds the distribution css file"
  task :css do
    require 'protodoc'
    require 'fileutils'
   
    Dir.chdir(CSS_SRC_DIR) do
      File.open(File.join(CSS_SRC_DIR, "production.css"), 'w+') do |dist|
        dist << Protodoc::Preprocessor.new("production.css.erb")
      end
    end
  end
  
end
