#!/bin/bash
# Switch active SSH to personal SSH key

eval $(ssh-agent -s)
ssh-add ~/.ssh/personal_rsa
ssh -T git@github.com
