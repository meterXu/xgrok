# mac下icns制作

准备icon.png 尺寸1024x1024

```bash
mkdir icons.iconset
cd icons.iconset
```

```bash
Sips -z 16 16 icon.png -o icon_16x16.png
Sips -z 32 32 icon.png -o icon_16x16@2x.png
Sips -z 32 32 icon.png -o icon_32x32.png
Sips -z 64 64 icon.png -o icon_32x32@2x.png
Sips -z 128 128 icon.png -o icon_128x128.png
Sips -z 256 256 icon.png -o icon_128x128@2x.png
Sips -z 256 256 icon.png -o icon_256x256.png
Sips -z 512 512 icon.png -o icon_256x256@2x.png
Sips -z 512 512 icon.png -o icon_512x512.png
Sips -z 1024 1024 icon.png -o icon_512x512@2x.png
```

```bash
cd ..
iconutil -c icns icons.iconset -o icon.icns
```

# mac下制作trayTemplate

推荐输出尺寸 32x32 64x64