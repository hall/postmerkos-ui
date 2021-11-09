sed -i "s|{{ PWD }}|$PWD|g" lighttpd.conf
lighttpd -f lighttpd.conf -D
