const icons = ["emoji_u1f3f3_200d_1f308.png", "emoji_u1f4af.png", "emoji_u1f9d0.png",
"emoji_u1f9d5_1f3fc.png", "emoji_u1f60d.png", "emoji_u1f61c.png",
"emoji_u1f62c.png", "emoji_u1f92f.png", "emoji_u1f346.png", "emoji_u1f351.png",
"emoji_u1f440.png", "emoji_u1f485.png", "emoji_u1f648.png",
"emoji_u1f937_1f3fc_200d_2640.png"];

function switchIcon () {
  var image = document.getElementsByClassName("icon")[0]
  var random_image = icons[Math.floor(Math.random() * icons.length)]
  image.src = `./img/emojis/${random_image}`
}

setInterval(function(){
  switchIcon()
}, 2000)
