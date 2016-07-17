" All system-wide defaults are set in $VIMRUNTIME/archlinux.vim (usually just
" /usr/share/vim/vimfiles/archlinux.vim) and sourced by the call to :runtime
" you can find below.  If you wish to change any of those settings, you should
" do it in this file (/etc/vimrc), since archlinux.vim will be overwritten
" everytime an upgrade of the vim packages is performed.  It is recommended to
" make changes after sourcing archlinux.vim since it alters the value of the
" 'compatible' option.

" This line should not be removed as it ensures that various options are
" properly set to work with the Vim-related packages.
runtime! archlinux.vim

colorscheme slate

" If you prefer the old-style vim functionalty, add 'runtime! vimrc_example.vim'
" Or better yet, read /usr/share/vim/vim74/vimrc_example.vim or the vim manual
" and configure vim to your own liking!
nmap <S-Enter> O<Esc>
nmap <CR> o<Esc>
" :imap jj <Esc>


let mapleader=","
nmap <silent> <leader><leader> :NERDTreeToggle<CR>

map <S-k> <C-w><Up>
map <S-j> <C-w><Down>
map <S-l> <C-w><Right>
map <S-h> <C-w><Left>

syntax on
set number

set hlsearch
set incsearch
set ignorecase
set smartcase

set splitbelow
set splitright

noremap <Leader>s :update<CR>

call plug#begin()

Plug 'scrooloose/nerdtree'
Plug 'ctrlpvim/ctrlp.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'scrooloose/syntastic'

call plug#end()

"let g:airline#extensions#tabline#enabled = 1
"let g:airline_powerline_fonts = 1
"let g:ctrlp_show_hidden = 1

"airline -------------------------------------------------
if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif

" the separator used on the left side
let g:airline_left_sep=''
" the separator used on the right side 
let g:airline_right_sep=''

let g:Powerline_symbols='unicode'


" unicode symbols
let g:airline_left_sep = '»'
let g:airline_left_sep = '▶'
let g:airline_right_sep = '«'
let g:airline_right_sep = '◀'
let g:airline_symbols.linenr = '␊'
let g:airline_symbols.linenr = '␤'
let g:airline_symbols.linenr = '¶'
let g:airline_symbols.branch = '⎇'
let g:airline_symbols.paste = 'ρ'
let g:airline_symbols.paste = 'Þ'
let g:airline_symbols.paste = '∥'
let g:airline_symbols.whitespace = 'Ξ'

" airline symbols
let g:airline_left_sep = ''
let g:airline_left_alt_sep = ''
let g:airline_right_sep = ''
let g:airline_right_alt_sep = ''
let g:airline_symbols.branch = ''
let g:airline_symbols.readonly = ''
let g:airline_symbols.linenr = ''
"airline ------------------------------------

set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_always_populate_loc_list = 0
let g:syntastic_auto_loc_list = 0
let g:syntastic_check_on_open = 0
let g:syntastic_aggregate_errors = 1

let g:syntastic_check_on_wq = 0

