# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

LC_CTYPE="ru_RU.UTF-8"
export LANG="ru_RU.UTF-8"
LC_ALL=ru_RU.UTF-8


ZSH_THEME="agnoster1"

ENABLE_CORRECTION="true"

plugins=(git)
plugins=(zsh-autosuggestions)

# User configuration


export PATH="/usr/local/sbin:/usr/local/bin:/usr/bin:/opt/android-sdk/tools:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl"
# export MANPATH="/usr/local/man:$MANPATH"
alias s='sudo pacman -S'

alias startT='teamviewer --daemon start'

alias stopT='teamviewer --daemon stop'

alias sus='sudo pm-suspend'

alias S='sudo pacman -Syu'

alias y='yaourt'

alias yu='yaourt -Syu --aur'

alias Y='yaourt -Syua --noconfirm'

alias h='history'

alias grep='egrep'

alias v='nvim'

alias df='df -m'

alias disk='sudo fdisk -l'

alias tree='find . -type d | sed -e "s/[^-][^\/]*\//  |/g" -e "s/|\([^ ]\)/|-\1/"'

alias remove='yaourt -Rs'

alias poff='sudo systemctl poweroff'

alias caps='xmodmap ~/.Xmodmap'

# alias csc='touch main.cpp CMakeLists.txt'
alias csc='echo "int main() {
	return 0;
}" > main.cpp'

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
# export SSH_KEY_PATH="~/.ssh/dsa_id"<Paste>

COMPLETION_WAITING_DOTS="false"
zstyle ':completion:*' menu select

# bindkey -v

bindkey '^P' up-history
bindkey '^N' down-history
bindkey '^?' backward-delete-char
bindkey '^h' backward-delete-char
bindkey '^w' backward-kill-word
bindkey '^r' history-incremental-search-backward

precmd() { RPROMPT="" }
function zle-line-init zle-keymap-select {
VIM_PROMPT="%{$fg_bold[yellow]%} [% NORMAL]%  %{$reset_color%}"
RPS1="${${KEYMAP/vicmd/$VIM_PROMPT}/(main|viins)/} $EPS1"
zle reset-prompt
}

zle -N zle-line-init
zle -N zle-keymap-select

export KEYTIMEOUT=1
zstyle ':completion:*' menu select
