#!/usr/bin/env ruby

dir = ARGV[0]

puts dir
output = `palm-package #{dir}`
puts ''
ipk = output.split(' ')[2]
name = ipk.split('_')[0]

puts `palm-launch -c #{name}`
puts ''
puts `palm-install -r #{name}`
puts ''
puts `palm-install #{ipk}`
puts ''
puts `palm-launch #{name}`
