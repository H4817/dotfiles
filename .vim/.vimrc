runtime! archlinux.vim
nmap <S-Enter> O<Esc>
nmap <CR> o<Esc>

let mapleader=","
nmap <silent> <leader><leader> :NERDTreeToggle<CR>

syntax on
" set number

set relativenumber

set cursorline

set hlsearch
set incsearch
set ignorecase
set smartcase

set tabstop=4
set shiftwidth=4
set softtabstop=4
set expandtab

set splitbelow
set splitright

noremap <Leader>s :update<CR>

call plug#begin()

Plug 'scrooloose/nerdtree'
Plug 'ctrlpvim/ctrlp.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'scrooloose/syntastic'
Plug 'w0ng/vim-hybrid'
Plug 'tpope/vim-fugitive'
Plug 'nanotech/jellybeans.vim'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-repeat'
Plug 'SirVer/ultisnips'

 Plug 'lifepillar/vim-wwdc16-theme'

call plug#end()



"airline -------------------------------------------------
let g:airline#extensions#tabline#enabled = 1
let g:airline_powerline_fonts = 1

if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif

let g:airline_theme='base16_grayscale'
let g:airline_skip_empty_sections = 1

"airline ------------------------------------

set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_always_populate_loc_list = 0
let g:syntastic_auto_loc_list = 0
let g:syntastic_check_on_open = 0
let g:syntastic_aggregate_errors = 1

let g:syntastic_check_on_wq = 0

let g:jellybeans_overrides = {
\    'background': { 'ctermbg': 'none', '256ctermbg': 'none' },
\}

set background=dark
colorscheme jellybeans
