        function $(selector) {
            return document.querySelector(selector)
        }
        
        var order = 0;
        var audio = new Audio()
        audio.autoplay = false
        var musicBag = []

        function getMusicList(callback) {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', 'https://kotou.github.io/musicjson/music.json', true)
            xhr.send()
            xhr.addEventListener('load', function () {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    callback(JSON.parse(xhr.responseText))
                } else {
                    alert('error')
                }
            })
        }

        getMusicList(function (sequence) {
            information(sequence[order])
            musicBag = sequence
            generateList(sequence)
        })

        function information(musicObj) {
            $('.music-box .title').innerText = musicObj.title
            $('.music-box .singer').innerText = musicObj.auther
            $('.backdrop').style.backgroundImage = 'url(' + musicObj.img + ')'
            audio.src = musicObj.src
        }

        audio.ontimeupdate = function () {
            $('.music-box .Progress-bar').style.width = (this.currentTime / this.duration) * 100 + '%'
        }
        audio.onplay = function () {
            clock = setInterval(function () {
                var minute = Math.floor(audio.currentTime / 60)
                var second = Math.floor(audio.currentTime) % 60 + ''
                second = second.length === 2 ? second : '0' + second
                $('.music-box .time').innerText = minute + ':' + second
            }, 1000)
            for (var i = 0; i < $('.box .list').children.length; i++) {
                $('.box .list').children[i].classList.remove('sign')
            }
            $('.box .list').children[order].classList.add('sign')
        }
        audio.onpause = function () {
            clearInterval(clock)
        }
        $('.btn .fa').onclick = function () {
            if (audio.paused) {
                audio.play()
                this.classList.remove('icon-play')
                this.classList.add('icon-pause')
            } else {
                audio.pause()
                this.classList.remove('icon-pause')
                this.classList.add('icon-play')
            }
        }
        $('.btn .icon-next').onclick = function () {
            order = (++order) % musicBag.length
            if (audio.paused) {
                $('.btn .fa').classList.remove('icon-play')
                $('.btn .fa').classList.add('icon-pause')
                information(musicBag[order])
                audio.play()
            } else {
                information(musicBag[order])
                audio.play()
            }
        }
        $('.btn .icon-previous').onclick = function () {
            order = (musicBag.length + --order) % musicBag.length
            if (audio.paused) {
                $('.btn .fa').classList.remove('icon-play')
                $('.btn .fa').classList.add('icon-pause')
                information(musicBag[order])
                audio.play()
            } else {
                information(musicBag[order])
                audio.play()
            }
        }
        audio.onended = function () {
            order = (++order) % musicBag.length
            information(musicBag[order])
            audio.play()
        }
        $('.clearfix .bar').onclick = function (e) {
            var percentage = e.offsetX / parseInt(getComputedStyle(this).width)
            audio.currentTime = audio.duration * percentage
        }

        function generateList(sequence) {
            var docFragment = document.createDocumentFragment()
            sequence.forEach(function (musicObj) {
                var node = document.createElement('li')
                node.innerText = musicObj.auther + '-' + musicObj.title
                docFragment.appendChild(node)
            })
            $('.box .list').appendChild(docFragment)
        }

        $('.box .list').onclick = function (e) {
            if (e.target.tagName.toLowerCase() === 'li') {
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i] === e.target) {
                        order = i
                    }
                }
                if (audio.paused) {
                    $('.btn .fa').classList.remove('icon-play')
                    $('.btn .fa').classList.add('icon-pause')
                    information(musicBag[order])
                    audio.play()
                } else {
                    information(musicBag[order])
                    audio.play()
                }
            }
        }
