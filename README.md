# vue-create-pdf
vue pdf nuxt puppeteer

# 注意
demo项目在慢慢制作中 请稍等

# 前言
前一个项目采用的是java获取html再通过itext生成pdf的方式，由于itext毕竟不是真实浏览器，其中太多的坑（具体请看java-vue-pdf中的注意事项）。并且由于新需求出现，已经完全不能实现需求了。所以寻求了一种新技术，摒弃java，全面拥抱node，采用chrome内核node版puppeteer插件完成浏览器能做的所有事情，包括计算高度宽度，调用打印生成pdf，所有浏览器能做的事情都能通过js进行调用。


# 时序图
![Image text](https://raw.githubusercontent.com/JannsenYang/vue-create-pdf/master/sequence-diagram.jpg)
