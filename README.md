#Share Data Server

##開發環境建置(MAC)

###1.安裝docker 
請至下列網址，來下載docker。

	https://docs.docker.com/docker-for-mac/

安裝完後在`shell`執行`docker --version`有看到版好就代表安裝成功。


###2.執行docker 


###
	docker-compose yo
	
該指令會讀取`docker-compose.yml`來進行`container`建立。


###3. 測試

開啟container後，可以使用該指令測試

	npm test
	
如果測試有跑出來則代表安裝成功。