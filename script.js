let app = {
    tabuleiro : document.querySelector("#tabuleiro"),
    botao : document.querySelector('#start'),
    botaoRecorde:document.querySelector('#record'),
    images: [
        'atletico.jpg',
        'corinthians.jpg',
        'flamengo.jpg',
        'gremio.jpg',
        'inter.jpg',
        'palmeiras.png',
        'santos.jpg',
        'saopaulo.png'
    ],
    iniciar: function () {
        this.images.forEach(img =>{

            for (let i = 0; i < 2; i++) {
                let carta=document.createElement('div')
                carta.className = 'carta'
                carta.classList.add('virar')
                carta.dataset.img = `img/${img}`
                let frente=document.createElement('img')
                frente.className='frente'
                frente.classList.add('face')
                let fundo=document.createElement('img')
                fundo.className='fundo'
                fundo.classList.add('face')
                frente.src=`img/${img}`
                fundo.src="img/bola.jpg"
                carta.appendChild(frente)
                carta.appendChild(fundo)
                this.tabuleiro.appendChild(carta)
            }
        } )
        let cartas = document.querySelectorAll('.carta')
        this.botao.addEventListener('click',iniciarJogo)
        let pontos=0;
        function iniciarJogo() {
            pontos=0;
            cartas.forEach(carta => carta.classList.add('virar') )
            reset();
            start();
            cartas.forEach(carta =>{
                carta.style.order = Math.floor(Math.random() * 16);
            } )
            setTimeout(()=>{
                cartas.forEach(carta => carta.classList.remove('virar') )
                cartas.forEach(carta => carta.addEventListener('click',virarCartas))
            },3000)
        }
        let jogada1,jogada2,acerto,bloqueio=false;
        function virarCartas(){
            if (!bloqueio){
                this.classList.add('virar')
                if (!jogada1){
                    jogada1=this;

                    return false
                }else{
                    jogada2=this;
                    if (!checarJogada()){
                        bloqueio = true
                        reproduzirErro()
                        setTimeout(()=>{
                            jogada1.classList.remove('virar')
                            jogada2.classList.remove('virar')
                            bloqueio=false
                            resetar()
                        },1500)
                    }else{
                        reproduzirSom()
                        jogada1.removeEventListener('click',virarCartas)
                        jogada2.removeEventListener('click',virarCartas)
                        resetar()
                        pontos++;
                        if (pontos===8){
                            reproduzirVitoria();
                            checarRecorde();
                            pause();
                        }
                    }
                }
            }
        }
        function checarJogada(){
            acerto = jogada1.dataset.img === jogada2.dataset.img;
            return acerto;
        }
        function resetar(){
            [jogada1,jogada2] = [null,null]
        }
        let hour = 0;
        let minute = 0;
        let second = 0;
        let millisecond = 0;

        let cron;

        function start() {
            pause();
            cron = setInterval(() => { timer(); }, 10);
        }
        function pause() {
            clearInterval(cron);
        }

        function reset() {
            hour = 0;
            minute = 0;
            second = 0;
            millisecond = 0;
            document.getElementById('hour').innerText = '00';
            document.getElementById('minute').innerText = '00';
            document.getElementById('second').innerText = '00';
        }

        function timer() {
            if ((millisecond += 10) === 1000) {
                millisecond = 0;
                second++;
            }
            if (second === 60) {
                second = 0;
                minute++;
            }
            if (minute === 60) {
                minute = 0;
                hour++;
            }
            document.getElementById('hour').innerText = returnData(hour);
            document.getElementById('minute').innerText = returnData(minute);
            document.getElementById('second').innerText = returnData(second);
        }

        function returnData(input) {
            return input > 10 ? input : `0${input}`
        }
        function reproduzirSom(){
            let som = jogada1.dataset.img;
            som = som.replace('img/','')
            let music = new Audio(`sound/${som}.mp3`);
            music.play();
        }
        function reproduzirErro(){
            let music = new Audio(`sound/faustao-errou.mp3`);
            music.play();
        }
        function reproduzirVitoria(){
            let music = new Audio(`sound/vinheta_gol_fox_sports_falarwww.toquesengracadosmp3.com.mp3`);
            music.play();
        }
        function checarRecorde(){
                if(localStorage.getItem("Recorde")===null){
                    let recorde=[returnData(hour) , returnData(minute) , returnData(second)]
                    localStorage.setItem("Recorde", JSON.stringify(recorde))
                }else{
                    let checagem=JSON.parse(localStorage.getItem("Recorde"));
                    console.log(checagem)
                    if (checagem[0]>=returnData(hour)){
                        if (checagem[1]>=returnData(minute)){
                            if (checagem[2]>=returnData(second)){
                                let recorde=[returnData(hour) , returnData(minute) , returnData(second)]
                                localStorage.setItem("Recorde", JSON.stringify(recorde))
                            }
                        }
                    }
                }
        }
        this.botaoRecorde.addEventListener('click',mostrarRecorde)
        function mostrarRecorde(){
            let recordeShow=JSON.parse(localStorage.getItem("Recorde"));
            document.getElementById('hour').innerText = recordeShow[0];
            document.getElementById('minute').innerText = recordeShow[1];
            document.getElementById('second').innerText = recordeShow[2];
        }
    },

}

app.iniciar();