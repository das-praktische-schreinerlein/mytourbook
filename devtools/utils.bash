#!/bin/bash

FINDBIN=/cygdrive/C/Programme/cygwin64/bin/find

# usage:
#     replace_text_in_file SRCFILE SRC INSERTFILE
replace_text_in_file() 
{
    REPLACEMENT=$(echo $3 | sed -e 's/[]\/$*.^|[]/\\&/g')
    sed s/$2/$REPLACEMENT/g ${1} > ${1}.tmp_replace_text_in_file_$$
    mv ${1}.tmp_replace_text_in_file_$$ ${1}
}
# usage:
#     replace_text_with_file SRCFILE SRC INSERTFILE
replace_text_with_file() 
{
    pattern=
    sed "/$2/r $3" ${1} > ${1}.tmp_replace_text_with_file_$$
    sed s/$2//g ${1}.tmp_replace_text_with_file_$$ > ${1}
    rm ${1}.tmp_replace_text_with_file_$$
}
