# path to your oh-my-zsh installation.
  export zsh=$home/.oh-my-zsh

zsh_theme="agnoster"

enable_correction="true"

plugins=(git)

# user configuration

  export path="/usr/local/sbin:/usr/local/bin:/usr/bin:/opt/android-sdk/tools:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl"
# export manpath="/usr/local/man:$manpath"
alias s='sudo pacman -s'

alias s='sudo pacman -syu'

alias y='yaourt'

alias y='yaourt -syua --noconfirm'

alias h='history'

alias grep='egrep'

alias df='df -m'

source $zsh/oh-my-zsh.sh


# you may need to manually set your language environment
# export lang=en_us.utf-8

# preferred editor for local and remote sessions
# if [[ -n $ssh_connection ]]; then
#   export editor='vim'
# else
#   export editor='mvim'
# fi

# compilation flags
# export archflags="-arch x86_64"

# ssh
# export ssh_key_path="~/.ssh/dsa_id"
