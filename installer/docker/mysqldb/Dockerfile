FROM mysql:5.7

# https://github.com/docker-library/mysql/blob/b4b7c8eea0690d0406a5ffc2d3404c8c42457a2d/5.7/Dockerfile
COPY docker-entrypoint-initdb.d/*.sql /docker-entrypoint-initdb.d/

ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 3306
CMD ["mysqld"]
