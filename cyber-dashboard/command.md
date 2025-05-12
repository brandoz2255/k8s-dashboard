
###  This is the  command to use when changes  are successful  and to test image keep changing the version to most recent one 

- also the stable version  of this is aimed at 0.1.0 so we end .0.0.x when ever we got a good stable version of the 
- cyber command web app for managing our k8s homeserver infrastructure

```bash
sudo docker buildx build --push  --platform linux/amd64,linux/arm64 -t dulc3/cyber-command-fr:0.0.1 .
```
