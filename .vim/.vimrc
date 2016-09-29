runtime! archlinux.vim

nmap <S-Enter> O<Esc>
nmap <CR> o<Esc>
nmap K i<CR><Esc>


" Options {{{1
set relativenumber
set cursorline

set nohlsearch
set incsearch
set ignorecase
set smartcase

set tabstop=4
set shiftwidth=4
set softtabstop=4
set expandtab

set splitbelow
set splitright

set wrap
set linebreak
set foldmethod=marker
set smartindent
set clipboard=unnamed

set keymap=russian-jcukenwin
set iminsert=0
set imsearch=0
highlight lCursor guifg=NONE guibg=Cyan

" Plugins {{{1
call plug#begin()

Plug 'scrooloose/nerdtree'
Plug 'ctrlpvim/ctrlp.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'scrooloose/syntastic'
Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-repeat'
Plug 'SirVer/ultisnips'
Plug 'flazz/vim-colorschemes'
Plug 'terryma/vim-multiple-cursors'

call plug#end()

syntax on

" Syntastic {{{2
let g:syntastic_always_populate_loc_list = 0
let g:syntastic_auto_loc_list = 0
let g:syntastic_check_on_open = 0
let g:syntastic_aggregate_errors = 1
let g:syntastic_check_on_wq = 0

" Fugitive {{{2
nnoremap <space>ga :Git add %:p<CR><CR>
nnoremap <space>gs :Gstatus<CR>
nnoremap <space>gc :Gcommit -v -q<CR>
nnoremap <space>gt :Gcommit -v -q %:p<CR>
nnoremap <space>gd :Gdiff<CR>
nnoremap <space>ge :Gedit<CR>
nnoremap <space>gr :Gread<CR>
nnoremap <space>gw :Gwrite<CR><CR>
nnoremap <space>gl :silent! Glog<CR>:bot copen<CR>
nnoremap <space>gp :Ggrep<Space>
nnoremap <space>gm :Gmove<Space>
nnoremap <space>gb :Git branch<Space>
nnoremap <space>go :Git checkout<Space>
nnoremap <space>gps :Dispatch! git push<CR>
nnoremap <space>gpl :Dispatch! git pull<CR>
" Statusline {{{2
let g:airline#extensions#tabline#enabled = 1
let g:airline_powerline_fonts = 1

if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif

let g:airline_theme='base16_grayscale'
let g:airline_skip_empty_sections = 1

set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

" Leaders {{{1
noremap <Leader>s :update<CR>
nmap <silent> <leader><leader> :NERDTreeToggle<CR>
" let mapleader=","


" Colorscheme {{{1
set background=dark
colorscheme jellybeans
let g:jellybeans_overrides = {
\    'background': { 'ctermbg': 'none', '256ctermbg': 'none' },
\}

" Extended Text Objects {{{1
let s:items = [ "<bar>", "\\", "/", ":", ".", "*", "_" ]
for item in s:items
    exe "nnoremap yi".item." T".item."yt".item
    exe "nnoremap ya".item." F".item."yf".item
    exe "nnoremap ci".item." T".item."ct".item
    exe "nnoremap ca".item." F".item."cf".item
    exe "nnoremap di".item." T".item."dt".item
    exe "nnoremap da".item." F".item."df".item
    exe "nnoremap vi".item." T".item."vt".item
    exe "nnoremap va".item." F".item."vf".item
endfor
" Select within fold
nnoremap viz v[zo]z$

" }}} vim: fdm=marker