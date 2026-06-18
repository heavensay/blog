# blog仓库介绍
hugo站点服务，编译、静态内容生成，服务部署；

# 脚本介绍
generate-_index.sh：用以生成blog-content下面各目录对应_index.md文件，使hugo左侧页面可以树状结构展示文章目录结构；  
hugo-docker-compose.yaml：hugo docker的启动脚本  
hugo-start.sh：启动hugo服务的脚本，hugo-docker-compose.yaml中会使用此脚本；  
.github/workflows/hugo.yaml：github pages ci/cd使用的脚本，默认路径；  
  
# 配置说明
hugo的配置文件config.toml，关键参数说明；  
~~~
baseURL = 'https://heavensay.github.io/blog'  #本地访问就是http:127.0.0.1:!313/blog;  
theme = "lotusdocs"   #指定 LotusDocs 主题  
  
  [[module.mounts]]
    #挂载除了template目录文件外的所有其他文件；blog-content仓库中的template目录是用于存放obsidian中的模版，不应该编译发布；
    files = ['! template/**', '**']
    source = "generated-content"  #store/blog-content->generated-content，最终以blog/tech路径来访问;
    target = "content/tech"

[[cascade]]
  type = "docs" #使用的是layouts/docs下面的模版
  layout = "single"
  [cascade.target]
    path = "/posts/**"

# 第 2 个级联配置：针对 tech 目录
[[cascade]]
  type = "docs" #使用的是layouts/docs下面的模版
  layout = "single"
  [cascade.target]
    path = "/tech/**"
~~~

# 自定义
我们使用了lotus主题，并对其中一些页面进行了定制。一般定义内容我们都放到layouts/下面，具体路径跟theme/lotus主题保持一致；
<img width="914" height="1214" alt="image" src="https://github.com/user-attachments/assets/8fbd7b2a-e19c-4a2f-97b4-574fca716d9f" />


## 附件路径修复
其中layouts/docs/_markup/render-image.html，和layouts/_default/_markup/render-image.html，用于附件路径渲染，修复md文档经过hugo发布后，路径层级多一层，附件访问404问题；  
blog-content仓库的内容，是在本地obsidian中编写的；其中结构如下：
~~~
obsidian仓库根目录/
	笔记本文件夹1/
		note-fold-1/
  			note1.md
  			note2.md
  			note-fold-1-1/
  				note3.md		
	attach-files/      --笔记本附件统一放到这里；附件放在对应笔记名对应的文件夹下面
		笔记本文件夹1/
			note-fold-1/
				note1/
					image.png
					1.pdf
				note2/
				note-fold-1-1/
					note3/
						image.png

md生成的附件地址：![](../../attach-files/笔记本文件夹1/note-fold-1/note1/image.png)。

blog-content发布到hugo后
note1访问路径：http://localhost:1313/blog/tech/本基本文件夹1/note-fold-1/note1/

note1页面附件地址为：http://localhost:1313/blog/tech/笔记本文件夹1/attach-files/笔记本文件夹1/note-fold-1/note1/image.png。
附件访问404；注意【note1访问路径】最后一个”/“，层级多了一层。

正确附件地址：http://localhost:1313/blog/tech/attach-files/笔记本文件夹1/note-fold-1/note1/image.png
~~~



# 常用命令

~~~
#hugo使用到的子模块加载
git submodule add https://github.com/varkor/hugo-theme-lotus store/themes/lotus
git submodule add https://github.com/colinwilson/lotusdocs themes/lotusdocs
git submodule add https://github.com/gohugoio/hugo-mod-bootstrap-scss themes/hugo-mod-bootstrap-scss
git submodule add https://github.com/gohugoio/hugo-mod-jslibs-dist themes/hugo-mod-jslibs-dist
git submodule add --depth=1 https://github.com/twbs/bootstrap themes/bootstrap
git submodule add --depth=1 https://github.com/heavensay/blog-content.git store/blog-content

#清理生成的静态内容，并重新编译生成
hugo --cleanDestinationDir
~~~


