# Path to your oh-my-zsh installation.
  export ZSH=$HOME/.oh-my-zsh

  LC_CTYPE="ru_RU.UTF-8"
  export LANG="ru_RU.UTF-8"
  LC_ALL=ru_RU.UTF-8

ZSH_THEME="agnoster"

ENABLE_CORRECTION="true"

plugins=(git)

# User configuration

  export PATH="/usr/local/sbin:/usr/local/bin:/usr/bin:/opt/android-sdk/tools:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl"
# export MANPATH="/usr/local/man:$MANPATH"
alias s='sudo pacman -s'

alias S='sudo pacman -Syu'

alias y='yaourt'

alias Y='yaourt -Syua --noconfirm'

alias h='history'

alias grep='egrep'

alias df='df -m'

alias disk='sudo fdisk -l'

alias tree='find . -type d | sed -e "s/[^-][^\/]*\//  |/g" -e "s/|\([^ ]\)/|-\1/"'

alias remove='yaourt -Rs'

source $ZSH/oh-my-zsh.sh


# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/dsa_id"
