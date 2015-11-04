server {
    listen {listen};
    server_name {serverName};
    root {directory};

    index index.html index.htm index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log /var/log/nginx/{serverName}-access.log;
    error_log  /var/log/nginx/{serverName}-error.log error;

    error_page 404 /index.php;

    sendfile off;

    location ~ \.php$ {
        try_files  $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_read_timeout 120;
        fastcgi_send_timeout 120;
        fastcgi_index index.php;
        fastcgi_param  SCRIPT_FILENAME   $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
