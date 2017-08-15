runtime! archlinux.vim

syntax on
nmap <S-Enter> O<Esc>
nmap <CR> o<Esc>
nmap K i<CR><Esc>

inoremap <M-d> <Esc>ldwi
inoremap <C-d> <Delete>
inoremap <C-b> <Left>
inoremap <C-f> <Right>

set lazyredraw

nnoremap n nzz
nnoremap N Nzz
nnoremap * *zz
nnoremap # #zz
nnoremap g* g*zz
nnoremap g# g#zz


" disable ex mode
noremap <S-q> <NOP> 

inoremap  <Up>     <NOP>
inoremap  <Down>   <NOP>
inoremap  <Left>   <NOP>
inoremap  <Right>  <NOP>
noremap   <Up>     <NOP>
noremap   <Down>   <NOP>
noremap   <Left>   <NOP>
noremap   <Right>  <NOP>

" allows incsearch highlighting for range commands
cnoremap $t <CR>:t''<CR>
cnoremap $T <CR>:T''<CR>
cnoremap $m <CR>:m''<CR>
cnoremap $M <CR>:M''<CR>
cnoremap $d <CR>:d<CR>``

" Allow saving of files as sudo when I forgot to start vim using sudo.
cmap w!! w !sudo tee > /dev/null %


"auto formatting
" imap <c-q> <Esc> gggqGgi  
nmap <c-q> gg=G<c-o><c-o>zz
imap <c-q> <Esc> gg=G<c-o><c-o>zzi

inoremap <C-j> <Esc>O<Esc>jA
inoremap <C-k> <Esc>ddkPA
nmap <c-s> :w<CR>
imap <c-s> <Esc>:w<CR>a

command! -bang -nargs=* Agu call fzf#vim#ag(<q-args>, '--skip-vcs-ignores', {'down': '~40%'})

" move visual block
vmap <c-l> olol
vmap <c-h> ohoh
vmap <c-j> ojoj
vmap <c-k> okok

" --column: Show column number
" --line-number: Show line number
" --no-heading: Do not show file headings in results
" --fixed-strings: Search term as a literal string
" --ignore-case: Case insensitive search
" --no-ignore: Do not respect .gitignore, etc...
" --hidden: Search hidden files and folders
" --follow: Follow symlinks
" --glob: Additional conditions for search (in this case ignore everything in the .git/ folder)
" --color: Search color options
command! -bang -nargs=* Find call fzf#vim#grep('rg --column --line-number --no-heading --fixed-strings --ignore-case --no-ignore --hidden --follow --glob "!.git/*" --color "always" '.shellescape(<q-args>), 1, <bang>0)
set grepprg=rg\ --vimgrep

vnoremap // y/<C-R>"<CR>

let mapleader= "\<Space>"

set wildmode=longest,list,full
set wildmenu

autocmd FileType php setlocal makeprg=zca\ %<.php
autocmd FileType php setlocal errorformat=%f(line\ %l):\ %m

"Gui settings {{{1
if has("gui_running")
	if has("gui_gtk2")
		set guifont=CodeNewRoman\ NF\ 14
	elseif has("gui_macvim")
		set guifont=Menlo\ Regular:h14
	elseif has("gui_win32")
		set guifont=Consolas:h11:cANSI
	endif
	set guioptions-=T
	set guioptions-=r
	set guioptions-=R
	set guioptions-=m
	set guioptions-=l
	set guioptions-=L
	set guitablabel=%t
endif

" Options {{{1
set relativenumber
set cursorline

set autochdir
set autoread

set nohlsearch
set incsearch
set ignorecase
set smartcase

set nobackup 	                            " no backup files
set nowritebackup                           " only in case you don't want a backup file while editing
set noswapfile 	                            " no swap files

set tabstop=4
set softtabstop=4
set shiftwidth=4
set noexpandtab

" jump to the last position when reopening a file
if has("autocmd")
  au BufReadPost * if line("'\"") > 0 && line("'\"") <= line("$")
    \| exe "normal! g'\"" | endif
endif

if has('nvim')
	set inccommand=split
endif

set tags=./tags,tags;$HOME

autocmd Filetype gitcommit setlocal spell textwidth=72
set colorcolumn=110
highlight ColorColumn ctermbg=darkgray

set splitbelow
set splitright

set wrap
set linebreak
set foldmethod=marker
set smartindent
set clipboard^=unnamed,unnamedplus

set keymap=russian-jcukenwin
set iminsert=0
set imsearch=0
highlight lCursor guifg=NONE guibg=Cyan

" Plugins {{{1
call plug#begin('~/.local/share/nvim/plugged')

Plug 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }
Plug 'scrooloose/nerdcommenter'
Plug 'tpope/vim-dispatch'
" Plug 'sickill/vim-pasta'
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'tpope/vim-fugitive'
Plug 'airblade/vim-gitgutter'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-repeat'
Plug 'flazz/vim-colorschemes'
"Plug 'Valloric/YouCompleteMe', { 'do': './install.py --clang-completer' }
"Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
Plug 'SirVer/ultisnips'
Plug 'honza/vim-snippets'
Plug 'majutsushi/tagbar'
Plug 'editorconfig/editorconfig-vim'
" Plug 'rking/ag.vim'
Plug 'scrooloose/syntastic'
Plug 'jiangmiao/auto-pairs'
Plug 'christoomey/vim-tmux-navigator'
Plug 'vim-scripts/ReplaceWithRegister'
Plug 'ryanoasis/vim-devicons'
Plug 'neovimhaskell/haskell-vim', { 'for': 'haskell' }
Plug 'dag/vim2hs', { 'for': 'haskell' }
" Plug 'easymotion/vim-easymotion'

"Plug 'Chiel92/vim-autoformat'
" Plug 'Yggdroot/indentLine'
"Plug 'w0rp/ale'


call plug#end()
" Syntastic {{{2

set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
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

" let g:airline_theme='base16_grayscale'
let g:airline_skip_empty_sections = 1
let g:airline#extensions#whitespace#enabled = 0


" Ultisnips {{{2
" Trigger configuration. Do not use <tab> if you use https://github.com/Valloric/YouCompleteMe.
let g:UltiSnipsSnippetsDir="~/.config/nvim/plugged/vim-snippets/UltiSnips"
" let g:UltiSnipsListSnippets="<c-l>"
" better key bindings for UltiSnipsExpandTrigger
let g:UltiSnipsExpandTrigger = "<tab>"
let g:UltiSnipsJumpForwardTrigger = "<tab>"
let g:UltiSnipsJumpBackwardTrigger = "<s-tab>"
 
" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"


" rg {{{2
noremap <Leader>a yiw :Find <C-r>"<CR>

" Ag {{{2
" noremap <Leader>a yiw :Agu <C-r>"<CR>
" Tmux navigator {{{2
let g:tmux_navigator_no_mappings = 1

nnoremap <silent> <C-h> :TmuxNavigateLeft<cr>
nnoremap <silent> <C-l> :TmuxNavigateRight<cr>
nnoremap <silent> <C-j> :TmuxNavigateDown<cr>
nnoremap <silent> <C-k> :TmuxNavigateUp<cr>

" YouCompleteMe {{{2
" make YCM compatible with UltiSnips (using supertab)
let g:ycm_show_diagnostics_ui = 0
let g:ycm_key_list_select_completion = ['<C-n>', '<Down>']
let g:ycm_key_list_previous_completion = ['<C-p>', '<Up>']
" let g:ycm_key_list_accept_completion = ['<C-space>']
let g:ycm_confirm_extra_conf = 0 
map <C-]> :YcmCompleter GoToImprecise<CR>
" let g:ycm_key_list_select_completion=[]
" let g:ycm_key_list_previous_completion=[]
let g:ycm_global_ycm_extra_conf = "~/dotfiles/dotfiles/.vim/.ycm_extra_conf.py"
let g:ycm_autoclose_preview_window_after_completion = 1
let g:ycm_autoclose_preview_window_after_insertion = 1


" ReplaceWithRegister {{{2
vmap p gr

" fzf {{{2
nnoremap <C-p> :Files<CR>
nnoremap <Leader>b :Buffers<CR>
nnoremap <Leader>l :Lines<CR>
nnoremap <Leader>/ :BLines<CR>
nnoremap <Leader>c :Commits<CR>
nnoremap <M-c> :Commands<CR>
" Leaders {{{1
noremap <Leader>s :update<CR>
nmap <silent> <leader><leader> :NERDTreeToggle<CR>
nnoremap <leader>v :tabnew $MYVIMRC<CR>
nnoremap <leader>r :so $MYVIMRC<CR>
nmap <leader>t :TagbarToggle<CR>

" Colorscheme {{{1
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
