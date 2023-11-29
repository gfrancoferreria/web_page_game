//Variables globales:
var canvasWidth;
var canvasHeight;
var velocidad_juego = 10;
var button; 
var primera_carga = true //para que el canvas solo redimensione los elementos una vez
//traje del astronauta seleccionado:
var spriteElegido;
//Parametros niveles:
var level = 1;
var level_duration = 3500

//contadores:
var time = 0;
var time_level = level_duration;

//Variables de los elementos:
//Frecuencia en la que aparecen los meteoritos:
var f_aparicion_met = 500;
var f_aparicion_ovni = 1000;
//numero max de meteoritos:
var numerodemet = 5;
var numerodeovnis = 5;
var movimiento_vertical = -1 //movimiento vertical ovnis

//Dimensiones de los elementos:
var escalabackground = 1
var escalameteor;
var escalaovni;
var escalaastro = 2

//Sonidos:
var mySound; //Sonido de impacto
var myMusic; //Música de fondo
var video1Sound; //Sonido vídeo 1

		/* PESTAÑAS  */
function openCity(evt, cityName) {
  let i, tabcontent, tablinks;
	
  // ocultar elementos con "tabcontent"
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
   // eliminar la clase "active" de los elementos en la clase "tabLinks"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
    // Mostrar pestaña actual y añadir clase "active" al botón pulsado
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

window.onload = init;

function init(){
	var intro = true;
	var recorrer_backround = 0
	//para sacar el escalado que hay que hacerle a los elementos del canvas en función de cómo cambia el tamaño el canvas
	var tamaño_canvas = new Array();
	var escalado_canvas
	
	var canvas = document.getElementById("micanvas")
	var ctx = canvas.getContext("2d");
	//sólo para la cuando se carga la página por primera vez
	if(primera_carga == true){
		canvas.width = window.innerWidth
		canvas.height = 0.50*canvas.width
	}
	//imagenes de los trajes para ser seleccionados:
	trajenaranja = document.getElementById("selnaranja");
	trajeverde = document.getElementById("selverde");
	
	inicializarCanvas()
	tamaño_canvas[0] = tamaño_canvas[1]
	escalado_canvas = tamaño_canvas[1]/tamaño_canvas[0]
	
	
	
	//Botones del canvas:
	//Botón pantalla final: coordenadas en función del tamaño actual del canvas
	var finalbuttWidth = 0.28*canvasWidth
	var finalbuttHeight = 0.23*canvasHeight
	var finalbuttcoordx = (canvasWidth/2) - (finalbuttWidth/2)
	var finalbuttcoordy = ((canvasHeight/2)+(0.062*canvasHeight)) - (finalbuttHeight/2)

	//Botón pantalla game over:
	var gobuttWidth = 0.28*canvasWidth
	var gobuttHeight = 0.23*canvasHeight
	var gobuttcoordx = (canvasWidth/2) - (gobuttWidth/2)
	var gobuttcoordy = ((canvasHeight/2)+(0.22*canvasHeight)) - (gobuttHeight/2)

	//Botón skip intro:
	var skipbuttWidth = 0.1*canvasWidth
	var skipbuttHeight = 0.09*canvasHeight
	var skipbuttcoordx = 0.88*canvasWidth
	var skipbuttcoordy = 0.039*canvasHeight

	//Botón pausa
	var pausabuttWidth = 0.1*canvasWidth
	var pausabuttHeight = 0.09*canvasHeight
	var pausabuttcoordx = 0.88*canvasWidth
	var pausabuttcoordy = 0.039*canvasHeight

	//Botón continuar
	var continuebuttWidth = 0.14*canvasWidth
	var continuebuttHeight = 0.16*canvasHeight
	var continuebuttcoordx = (canvasWidth/2) - (continuebuttWidth/2)
	var continuebuttcoordy = ((canvasHeight/2)+(0.22*canvasHeight)) - (continuebuttHeight/2)
	
	//movimientos de los elementos del juego en función del tamaño del canvas:
	var velocidadAstronauta = 5*(canvasWidth/1420)
	var vertical_oscilation = Math.floor(20*(canvasHeight/710))
	var vel_max_meteo = 4*(canvasWidth/1420);

	//declaración sonidos:
	video1Sound = new sound("./audios/audioaux1.mp3"); //Música vídeo 1
	mySound = new sound("./audios/impacto.mp3"); //Sonido de impacto
	myMusic = new sound("./audios/ambiente.mp3"); //Música de fondo
	
	var chosen_character = false; //Esta variable indica si se ha elegido el personaje. lo inicializamos a false
	
	//imagenes de momentos de la partida:
	imagenfinal = document.getElementById("imagenfinal"); //imagen final
	im_go = document.getElementById("go"); //game over
	start_im = document.getElementById("start_im"); //imagen pulsa barra espaciadora
	
	//variables de los vídeos
	video1 = document.getElementById("video1")
	video2 = document.getElementById("video2")
	video3 = document.getElementById("video3")
	videocharacter = document.getElementById("videocharacter") //vídeo de fondo de la selección personaje
	problem_vid = document.getElementById("videoproblems");
	expl_vid = document.getElementById("videoexplicacion");
	level1_vid = document.getElementById("level1");
	level2_vid = document.getElementById("level2");
	level3_vid = document.getElementById("level3");
	
	//redimensión de los botones de los trajes:
	trajewidth_naranja = trajenaranja.width*(canvasWidth/1420)
	trajeheight_naranja = trajenaranja.height*(canvasHeight/710)
	trajewidth_verde = trajeverde.width*(canvasWidth/1420)
	trajeheight_verde = trajeverde.height*(canvasHeight/710)
	
	var imagenbuttWidth = trajewidth_naranja
	var imagenbuttHeight = trajeheight_naranja
	var naranjabuttcoordx = 0.13*canvasWidth
	var naranjabuttcoordy = 0.27*canvasHeight
	var verdebuttcoordx = canvasWidth - (naranjabuttcoordx+imagenbuttWidth)
	var verdebuttcoordy = naranjabuttcoordy
	
	/*** El juego está diseñado para que el canvas se pueda cambiar de tamaño durante la ejecución a gusto del usuario ***/
	//Con esta función se llamará a inicializarCanvas que recalculará los valores del tamaño del canvas:
	
	setTimeout(function() {
		inicializarCanvas();
		addEventListener("resize", inicializarCanvas);
		}, 15);
		
	function inicializarCanvas(){

		
		if (canvas && canvas.getContext) {
			
				if (ctx){
		   // calcula la anchura y la altura del canvas
					var s = getComputedStyle(canvas);
					var w = s.width;
					var h = s.height;
		   // extrae el valor numerico
				tamaño_canvas[0] = tamaño_canvas[1]
				
				canvasWidth = canvas.width = w.split("px")[0];
				canvasHeight = canvas.height = h.split("px")[0];
				
				tamaño_canvas[1] = canvasWidth
				escalado_canvas = tamaño_canvas[1]/tamaño_canvas[0]
				
				
						//Botones del canvas:
						//Botón pantalla final:
						finalbuttWidth = 0.28*canvasWidth
						finalbuttHeight = 0.23*canvasHeight
						finalbuttcoordx = (canvasWidth/2) - (finalbuttWidth/2)
						finalbuttcoordy = ((canvasHeight/2)+(0.062*canvasHeight)) - (finalbuttHeight/2)

						//Botón pantalla game over:
						gobuttWidth = 0.28*canvasWidth
						gobuttHeight = 0.23*canvasHeight
						gobuttcoordx = (canvasWidth/2) - (gobuttWidth/2)
						gobuttcoordy = ((canvasHeight/2)+(0.22*canvasHeight)) - (gobuttHeight/2)

						//Botón skip intro:
						skipbuttWidth = 0.1*canvasWidth
						skipbuttHeight = 0.09*canvasHeight
						skipbuttcoordx = 0.88*canvasWidth
						skipbuttcoordy = 0.039*canvasHeight

						//Botón pausa
						pausabuttWidth = 0.1*canvasWidth
						pausabuttHeight = 0.09*canvasHeight
						pausabuttcoordx = 0.88*canvasWidth
						pausabuttcoordy = 0.039*canvasHeight

						//Botón continuar
						continuebuttWidth = 0.14*canvasWidth
						continuebuttHeight = 0.16*canvasHeight
						continuebuttcoordx = (canvasWidth/2) - (continuebuttWidth/2)
						continuebuttcoordy = ((canvasHeight/2)+(0.22*canvasHeight)) - (continuebuttHeight/2)
						
					//Creamos estas condiciones por si decidimos redimensionar la web para que se sigan pintando los elementos:
					
					if(button == 0 && intro == false){
						createButtonAndImage(finalbuttcoordx,finalbuttcoordy,finalbuttWidth,finalbuttHeight,ctx,imagenfinal,"RESTART")
					}
				
					if(button == 1 && intro == false){
						createButtonAndImage(finalbuttcoordx,finalbuttcoordy,finalbuttWidth,finalbuttHeight,ctx,imagenfinal,"RESTART")
					}
					if(button == 5 && intro == false){
						ctx.drawImage(spriteBackground[recorrer_backround],0,0,canvasWidth,canvasHeight)
						ctx.drawImage(astronauta.sprite[astronauta.recorrerSprite],astronauta.coordx,astronauta.coordy,(astronauta.sprite[astronauta.recorrerSprite].width/escalaastro)*escalado_canvas, (astronauta.sprite[astronauta.recorrerSprite].height/escalaastro)*escalado_canvas)
						for(let i = 0;i<meteoritos.length;i++){
							ctx.drawImage(meteoritos[i].sprite[meteoritos[i].recorrerSprite],meteoritos[i].coordx,meteoritos[i].coordy,(meteoritos[i].sprite[meteoritos[i].recorrerSprite].width/meteoritos[i].escala)*escalado_canvas, (meteoritos[i].sprite[meteoritos[i].recorrerSprite].height/meteoritos[i].escala)*escalado_canvas)
						}
						for(let i = 0;i<ovnis.length;i++){
							ctx.drawImage(ovnis[i].sprite[ovnis[i].recorrerSprite],ovnis[i].coordx,ovnis[i].coordy,(ovnis[i].sprite[ovnis[i].recorrerSprite].width/ovnis[i].escala)*escalado_canvas, (ovnis[i].sprite[ovnis[i].recorrerSprite].height/ovnis[i].escala)*escalado_canvas)
						}
						createButton(continuebuttcoordx,continuebuttcoordy,continuebuttWidth,continuebuttHeight,ctx,"CONTINUE");
						createButton(pausabuttcoordx,pausabuttcoordy,pausabuttWidth,pausabuttHeight,ctx,"PAUSE")
					}
					if(intro == true){
						ctx.drawImage(start_im,0,0,canvasWidth,canvasHeight)
					}
				}
		}
	}
	
	//movimiento del astronauta:
	
	var movimientox = 0;
	var movimientoy = 0;
	

	//Cargo los sprites de los elementos del juego:
	const spriteBackground = [document.getElementById("b1"),
		document.getElementById("b2"),
		document.getElementById("b3"),
		document.getElementById("b4"),
		document.getElementById("b5"),
		document.getElementById("b6"),
		document.getElementById("b7"),
		document.getElementById("b8"),
		document.getElementById("b9"),
		document.getElementById("b10"),
		document.getElementById("b11"),
		document.getElementById("b12"),
		document.getElementById("b13"),
		document.getElementById("b14"),
		document.getElementById("b15"),
		document.getElementById("b16"),
		document.getElementById("b17"),
		document.getElementById("b18"),
		document.getElementById("b19"),
		document.getElementById("b20"),
		document.getElementById("b21"),
		document.getElementById("b22"),
		document.getElementById("b23"),
		document.getElementById("b24"),
		document.getElementById("b25"),
		document.getElementById("b26"),
		document.getElementById("b27"),
		document.getElementById("b28"),
		document.getElementById("b29"),
		document.getElementById("b30"),
		document.getElementById("b31"),
		document.getElementById("b32"),
		document.getElementById("b33"),
		document.getElementById("b34"),
		document.getElementById("b35"),
		document.getElementById("b36"),
		document.getElementById("b37"),
		document.getElementById("b38"),
		document.getElementById("b39"),
		document.getElementById("b40"),
		document.getElementById("b41"),
		document.getElementById("b42"),
		document.getElementById("b43"),
		document.getElementById("b44"),
		document.getElementById("b45"),
		document.getElementById("b46"),
		document.getElementById("b47"),
		document.getElementById("b48"),
		document.getElementById("b49"),
		document.getElementById("b50"),
		document.getElementById("b51"),
		document.getElementById("b52"),
		document.getElementById("b53"),
		document.getElementById("b54"),
		document.getElementById("b55"),
		document.getElementById("b56"),
		document.getElementById("b57"),
		document.getElementById("b58"),
		document.getElementById("b59"),
		document.getElementById("b60"),
		document.getElementById("b61"),
		document.getElementById("b62"),
		document.getElementById("b63"),
		document.getElementById("b64"),
		document.getElementById("b65"),
		document.getElementById("b66"),
		document.getElementById("b67"),
		document.getElementById("b68"),
		document.getElementById("b69"),
		document.getElementById("b70"),
		document.getElementById("b71"),
		document.getElementById("b72"),
		document.getElementById("b73"),
		document.getElementById("b74"),
		document.getElementById("b75"),
		document.getElementById("b76"),
		document.getElementById("b77"),
		document.getElementById("b78"),
		document.getElementById("b79"),
		document.getElementById("b80"),
		document.getElementById("b81"),
		document.getElementById("b82"),
		document.getElementById("b83"),
		document.getElementById("b84"),
		document.getElementById("b85"),
		document.getElementById("b86"),
		document.getElementById("b87"),
		document.getElementById("b88"),
		document.getElementById("b89"),
		document.getElementById("b90"),
		document.getElementById("b91"),
		document.getElementById("b92"),
		document.getElementById("b93"),
		document.getElementById("b94"),
		document.getElementById("b95"),
		document.getElementById("b96"),
		document.getElementById("b97"),
		document.getElementById("b98"),
		document.getElementById("b99"),
		document.getElementById("b100"),
		document.getElementById("b101"),
		document.getElementById("b102"),
		document.getElementById("b103"),
		document.getElementById("b104"),
		document.getElementById("b105"),
		document.getElementById("b106"),
		document.getElementById("b107"),
		document.getElementById("b108"),
		document.getElementById("b109"),
		document.getElementById("b110"),
		document.getElementById("b111"),
		document.getElementById("b112"),
		document.getElementById("b113"),
		document.getElementById("b114"),
		document.getElementById("b115"),
		document.getElementById("b116"),
		document.getElementById("b117"),
		document.getElementById("b118"),
		document.getElementById("b119"),
		document.getElementById("b120")
		];

	const spriteMeteorito = [document.getElementById("meteorito"),
		document.getElementById("meteorito1"),
		document.getElementById("meteorito2"),
		document.getElementById("meteorito3"),
		document.getElementById("meteorito4"),
		document.getElementById("meteorito5"),
		document.getElementById("meteorito6"),
		document.getElementById("meteorito7"),
		document.getElementById("meteorito8"),
		document.getElementById("meteorito9")
		];
		
	const spriteOvni = [document.getElementById("ovni"),
		document.getElementById("ovni1"),
		document.getElementById("ovni2"),
		document.getElementById("ovni3"),
		document.getElementById("ovni4"),
		document.getElementById("ovni5"),
		document.getElementById("ovni6"),
		document.getElementById("ovni7"),
		document.getElementById("ovni8"),
		];
		
		
		
	const spriteAstronautaGreen = [document.getElementById("astro1Green"),
		document.getElementById("astro2Green"),
		document.getElementById("astro3Green"),
		document.getElementById("astro4Green")
		];
		
		
		
	const spriteAstronauta = [document.getElementById("astro1"),
		document.getElementById("astro2"),
		document.getElementById("astro3"),
		document.getElementById("astro4")
		];
		
		//sólo redimensiono en proporción los elementos del canvas en la primera carga de la página
		if(primera_carga == true){
			for(i=0;i<spriteMeteorito.length;i++){
			spriteMeteorito[i].width = spriteMeteorito[i].width*(canvasWidth/1420)
			spriteMeteorito[i].height = spriteMeteorito[i].height*(canvasHeight/710)
		}
		for(i=0;i<spriteOvni.length;i++){
			spriteOvni[i].width = spriteOvni[i].width*(canvasWidth/1420)
			spriteOvni[i].height = spriteOvni[i].height*(canvasHeight/710)
		}
		for(i=0;i<spriteAstronautaGreen.length;i++){
			spriteAstronautaGreen[i].width = spriteAstronautaGreen[i].width*(canvasWidth/1420)
			spriteAstronautaGreen[i].height = spriteAstronautaGreen[i].height*(canvasHeight/710)
		}
		for(i=0;i<spriteAstronauta.length;i++){
			spriteAstronauta[i].width = spriteAstronauta[i].width*(canvasWidth/1420)
			spriteAstronauta[i].height = spriteAstronauta[i].height*(canvasHeight/710)
		}
			primera_carga = false
		}
	
	//Objeto que contiene todo lo relacionado con el área de juego(canvas)
	
	var gameArea = {
	
		start : function() {
			this.interval = setInterval(updateGameArea, velocidad_juego);
		},
		
		borrar : function() {
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		}
	}
	
	
	
	//Objeto 'elemento' que será cualquier componente añadido al juego como los meteoritos, fondo, etc..
	
	var Elemento = function(coordx,coordy,movimiento,sprite,velocidad_refresco, escala){
		this.coordx = coordx;
		this.coordy = coordy;
		this.movimiento = movimiento;
		this.sprite = sprite;
		this.velocidad_refresco = velocidad_refresco;
		this.escala = escala; 
		this.contador = 0;
		this.recorrerSprite = 0;
		this.ancho_elemento = this.sprite[0].width/this.escala;
		this.alto_elemento = this.sprite[0].height/this.escala;
		
		//Esta función se encargará de actualizar los sprites de cada elemento:
		this.updateElement = function(){
			
			this.centroElementox = this.coordx+(this.ancho_elemento/2);
			this.centroElementoy = this.coordy+(this.alto_elemento/2);
			this.centroElementox1 = this.centroElementox;
			this.centroElementoy1 = this.centroElementoy-(this.alto_elemento/3);
			this.centroElementox2 = this.centroElementox;
			this.centroElementoy2 = this.centroElementoy+(this.alto_elemento/3);
			
			if(this.recorrerSprite < this.sprite.length){
				ctx.drawImage(this.sprite[this.recorrerSprite],this.coordx, this.coordy, (this.sprite[this.recorrerSprite].width/escala)*escalado_canvas, (this.sprite[this.recorrerSprite].height/escala)*escalado_canvas)
				if(this.contador == this.velocidad_refresco){
					this.recorrerSprite++;
					this.contador = 0;
					//Solución al parpadeo
					if(this.recorrerSprite == this.sprite.length){
						this.recorrerSprite = 0;
					}
				}else{
					this.contador++;
				}
			}
		}
	
	};
	
	//Función que devuelve un número aleatorio entre dos números:
	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min) ) + min;
	};
	
	//Función que calcula las distancias entre dos coordenadas del canvas:
	function distancia(coordx1,coordy1,coordx2,coordy2){
		return Math.sqrt(((coordx1-coordx2)**2)+((coordy1-coordy2)**2))
	}

	//Creación de elementos y matrices para guardar parámetros de dichos elementos:
	var astronauta;
	var meteoritos = new Array();
	var timespacemeteor = new Array();
	var timespaceovni = new Array();
	var initial_pos_ovni = new Array();
	var ovnis = new Array();

	
	function startgame(f_aparicion_met,numerodemet,vel_max_meteo){
		
		gameArea.start();
		
		document.addEventListener("click", buttonclick)
		button = 4 //Pongo el botón pausa a escuchar
		
		myMusic.play();
		
		timespacemeteor[0] = f_aparicion_met;
		timespaceovni[0] = f_aparicion_ovni;
		
		astronauta = new Elemento(0.07*canvasWidth,getRndInteger(0.15*canvasHeight,0.66*canvasHeight),0,spriteElegido,10,escalaastro)
		
		for(let i = 0;i<numerodemet;i++){
			escalameteor = getRndInteger(1, 4) //meteoritos y ovnis con distintos tamaños
			meteoritos[i] = new Elemento(canvasWidth,getRndInteger(0.15*canvasHeight,0.77*canvasHeight),getRndInteger((canvasWidth/1420),vel_max_meteo),spriteMeteorito,getRndInteger(2, 6),escalameteor);
			timespacemeteor[i+1] = timespacemeteor[i] + getRndInteger(f_aparicion_met*0.8,f_aparicion_met);
		}
		
		for(let i = 0;i<numerodeovnis;i++){
			escalaovni = getRndInteger(2, 5)
			ovnis[i] = new Elemento(canvasWidth,getRndInteger(0.15*canvasHeight,0.77*canvasHeight),getRndInteger(1,vel_max_meteo),spriteOvni,getRndInteger(2, 6),escalaovni);
			timespaceovni[i+1] = timespaceovni[i] + getRndInteger(f_aparicion_met*0.8,f_aparicion_met);
			initial_pos_ovni[i] = ovnis[i].coordy;
		}
	}
	
	
	//función que se refresca gracias a setInterval
	function updateGameArea(){
		
		gameArea.borrar();
		
		if(recorrer_backround<spriteBackground.length){
			ctx.drawImage(spriteBackground[recorrer_backround],0,0,canvasWidth,canvasHeight)
			recorrer_backround++;
			if(recorrer_backround == spriteBackground.length){
				recorrer_backround = 0
			}
		}
		astronauta.updateElement();
		createButton(pausabuttcoordx,pausabuttcoordy,pausabuttWidth,pausabuttHeight,ctx,"PAUSE")
		
		astronauta.coordx += movimientox
		astronauta.coordy += movimientoy
		
		if(astronauta.coordx<-20){
			movimientox = 0
			astronauta.coordx = -20;
		}
		if(astronauta.coordx>(canvasWidth-(imagenbuttWidth/escalaastro))){
			movimientox = 0
			astronauta.coordx = canvasWidth-(imagenbuttWidth/escalaastro)
		}
		if(astronauta.coordy<-20){
			movimientoy = 0
			astronauta.coordy = -20;
		}
		if(astronauta.coordy>(canvasHeight-(imagenbuttHeight/escalaastro))){
			movimientoy = 0
			astronauta.coordy = canvasHeight-(imagenbuttHeight/escalaastro)
		}
		if(level == 1 || level ==3){
			
			for(let i = 0;i<meteoritos.length;i++){
				meteoritos[i].updateElement();		
		
				if(time >= timespacemeteor[i]){
					meteoritos[i].coordx-=meteoritos[i].movimiento;
				}			
			}
		
			for(let i = 0; i<meteoritos.length; i++){
				if(meteoritos[i].coordx<-800){
					meteoritos[i].coordx = canvasWidth;
					meteoritos[i].coordy = getRndInteger(0.2*canvasHeight,0.8*canvasHeight);
					meteoritos[i].movimiento = getRndInteger(1,vel_max_meteo);
					timespacemeteor[i] = time + getRndInteger(Math.round(f_aparicion_met*0.8),f_aparicion_met);
				}
			}
			
		}
		
		if(level >= 2){
			
			for(let i = 0;i<ovnis.length;i++){
				ovnis[i].updateElement();		
				
				if(time >= timespaceovni[i]){
					ovnis[i].coordx-=ovnis[i].movimiento;
					//movimiento vertical
					if((ovnis[i].coordy!=initial_pos_ovni[i]-vertical_oscilation) && (ovnis[i].coordy!=initial_pos_ovni[i]+vertical_oscilation)){
						ovnis[i].coordy+=movimiento_vertical;
					}else{
						if(ovnis[i].coordy==initial_pos_ovni[i]-vertical_oscilation){
							movimiento_vertical = 1
						}
						if(ovnis[i].coordy==initial_pos_ovni[i]+vertical_oscilation){
							movimiento_vertical = -1
						}
						ovnis[i].coordy+=movimiento_vertical
					}
				}	
			}
		
			for(let i = 0; i<ovnis.length; i++){
				if(ovnis[i].coordx<-800){
					ovnis[i].coordx = canvasWidth;
					ovnis[i].coordy = getRndInteger(0.2*canvasHeight,0.8*canvasHeight);
					initial_pos_ovni[i] = ovnis[i].coordy; //actualizo posición inicial para referenciar el movimiento vertical
					ovnis[i].movimiento = getRndInteger(1,vel_max_meteo);
					timespaceovni[i] = time + getRndInteger(Math.round(f_aparicion_ovni*0.8),f_aparicion_ovni);
				}
			}
		}
		
		time++;
		time_level--
		colisiones();
		pass_level(level)
		
	}
	
	function pass_level(nivel){
		if(time_level == 0){
			myMusic.stop(); // Se silencia la música de fondo
			clearInterval(gameArea.interval);
			gameArea.borrar();
				if (nivel == 1){
					myMusic.stop(); // Se silencia la música de fondo
					clearInterval(gameArea.interval);
					gameArea.borrar();
					video2.play()
					level++;
				}
				if (nivel == 2){
					myMusic.stop(); // Se silencia la música de fondo
					clearInterval(gameArea.interval);
					gameArea.borrar();
					video3.play()
					level++;
				}
				if (nivel == 3){
					myMusic.stop(); // Se silencia la música de fondo
					clearInterval(gameArea.interval);
					gameArea.borrar();
					button = 1
					//Esta parte va a finalizar el juego con una pantalla en la que se muestra un botón para empezar de nuevo y un mensaje de victoria
					level = 1
					createButtonAndImage(finalbuttcoordx,finalbuttcoordy,finalbuttWidth,finalbuttHeight,ctx,imagenfinal,"RESTART")
					document.addEventListener("click", buttonclick)
				}
				
				time_level = level_duration;
				time = 0;
		}
	}

	//creación de botón en una imagen:
	function createButtonAndImage(buttoncoordx,buttoncoordy,buttonWidth,buttonHeight,context,image,texto){
		context.drawImage(image,0,0,canvasWidth,canvasHeight)
		context.beginPath();
		context.strokeStyle = "white";
		context.rect(buttoncoordx, buttoncoordy, buttonWidth, buttonHeight);
		context.fillStyle = "white";
		context.fill();
		//text
		pixels = 80*(canvasWidth/1420)
		context.font = pixels.toString()+"px FuenteNasa";
		context.fillStyle = "black"
		context.textAlign = "center";
		context.fillText(texto,buttoncoordx+(buttonWidth/2),buttoncoordy+(buttonHeight/2)+(30*(canvasHeight/710)));
	}
	
	
	//creación de botón sin imagen:
	function createButton(buttoncoordx,buttoncoordy,buttonWidth,buttonHeight,context,texto){
		context.beginPath();
		context.strokeStyle = "white";
		context.rect(buttoncoordx, buttoncoordy, buttonWidth, buttonHeight);
		context.fillStyle = "#CFCFCF";
		context.fill();
		//text
		pixels = 30*(canvasWidth/1420)
		context.font = pixels.toString()+"px FuenteNasa";
		context.fillStyle = "black"
		context.textAlign = "center";
		context.fillText(texto,buttoncoordx+(buttonWidth/2),buttoncoordy+(buttonHeight/2)+(10*(canvasHeight/710)));
	}
	//función que maneja los botones:
	function buttonclick(){
		
		//devuelvo las coordenadas dónde hace click el ratón
		const rect = canvas.getBoundingClientRect()
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;

		//si es game over
		if(button == 0){
		
			limitexizqda = gobuttcoordx
			limitexdrcha = gobuttcoordx + gobuttWidth
			limiteyabajo = gobuttcoordy
			limiteyarriba = gobuttcoordy + gobuttHeight
			
			if(x >= limitexizqda && x <= limitexdrcha){
				if(y >= limiteyabajo && y <= limiteyarriba){
					document.removeEventListener("click", buttonclick);
					primera_carga = false;
					init();
				}
			}
		
		}
		//si es la pantalla final
		if(button == 1){
			limitexizqda = finalbuttcoordx
			limitexdrcha = finalbuttcoordx + finalbuttWidth
			limiteyabajo = finalbuttcoordy
			limiteyarriba = finalbuttcoordy + finalbuttHeight
			
			if(x >= limitexizqda && x <= limitexdrcha){
				if(y >= limiteyabajo && y <= limiteyarriba){
					document.removeEventListener("click", buttonclick);
					primera_carga = false
					init();
				}
			}
		}
		//botón skip
		if(button == 2){
			limitexizqda = skipbuttcoordx
			limitexdrcha = skipbuttcoordx + skipbuttWidth
			limiteyabajo = skipbuttcoordy
			limiteyarriba = skipbuttcoordy + skipbuttHeight
			
			if(x >= limitexizqda && x <= limitexdrcha){
				if(y >= limiteyabajo && y <= limiteyarriba){
					document.removeEventListener("click", buttonclick);
					if(video1.paused == false){
						video1.currentTime = video1.duration
						video1Sound.stop()
					}
					if(video2.paused == false){
						video2.currentTime = video2.duration
					}
					if(video3.paused == false){
						video3.currentTime = video3.duration
					}
					if(expl_vid.paused == false){
						expl_vid.currentTime = expl_vid.duration
					}
					if(problem_vid.paused == false){
						problem_vid.currentTime = problem_vid.duration
					}
				}
			}
		}
		//Botón personajes
		if(button == 3){
			
			//Naranja:
			limitexizqda1 = naranjabuttcoordx
			limitexdrcha1 = naranjabuttcoordx + imagenbuttWidth
			limiteyabajo1 = naranjabuttcoordy
			limiteyarriba1 = naranjabuttcoordy + imagenbuttHeight
			
			//Verde:
			limitexizqda2 = verdebuttcoordx
			limitexdrcha2 = verdebuttcoordx + imagenbuttWidth
			limiteyabajo2 = verdebuttcoordy
			limiteyarriba2 = verdebuttcoordy + imagenbuttHeight
			
			if(x >= limitexizqda1 && x <= limitexdrcha1){
				if(y >= limiteyabajo1 && y <= limiteyarriba1){
					document.removeEventListener("click", buttonclick);
					spriteElegido = spriteAstronauta;
					chosen_character = true;
					videocharacter.currentTime = videocharacter.duration
				}
			}
			if(x >= limitexizqda2 && x <= limitexdrcha2){
				if(y >= limiteyabajo2 && y <= limiteyarriba2){
					document.removeEventListener("click", buttonclick);
					spriteElegido = spriteAstronautaGreen;
					chosen_character = true;
					videocharacter.currentTime = videocharacter.duration
				}
			}
		}
		//botón pausa
		if(button == 4){
			limitexizqda1 = pausabuttcoordx
			limitexdrcha1 = pausabuttcoordx + pausabuttWidth
			limiteyabajo1 = pausabuttcoordy
			limiteyarriba1 = pausabuttcoordy + pausabuttHeight
			
			if(x >= limitexizqda1 && x <= limitexdrcha1){
				if(y >= limiteyabajo1 && y <= limiteyarriba1){
					clearInterval(gameArea.interval);
					createButton(continuebuttcoordx,continuebuttcoordy,continuebuttWidth,continuebuttHeight,ctx,"CONTINUE");
					myMusic.stop();
					button = 5;
				}
			}
		}
		//botón continuar
		if(button == 5){
			limitexizqda1 = continuebuttcoordx
			limitexdrcha1 = continuebuttcoordx + continuebuttWidth
			limiteyabajo1 = continuebuttcoordy
			limiteyarriba1 = continuebuttcoordy + continuebuttHeight
			
			if(x >= limitexizqda1 && x <= limitexdrcha1){
				if(y >= limiteyabajo1 && y <= limiteyarriba1){
					gameArea.interval = setInterval(updateGameArea, velocidad_juego);
					myMusic.play();
					button = 4;
				}
			}
		}
	}
	
	
	
	function saltarIntro(video, context){
		if(video.currentTime >= 4){
			button = 2
			createButton(skipbuttcoordx,skipbuttcoordy,skipbuttWidth,skipbuttHeight,context,"SKIP")
			document.addEventListener("click", buttonclick)
		}
	}
	
	function game_over(){
		mySound.play(); // Se activa el sonido de impacto
		myMusic.stop(); // Se silencia la música de fondo
		clearInterval(gameArea.interval);
		gameArea.borrar();
		level = 1 //Se reinician los niveles;
		time_level = level_duration;
		time = 0;
		
		button = 0
		createButtonAndImage(gobuttcoordx,gobuttcoordy,gobuttWidth,gobuttHeight,ctx,im_go,"RESTART")
		document.addEventListener("click", buttonclick)
	}
	
	function colisiones() {
		
		for(let i=0;i<meteoritos.length;i++){
			if((	(distancia(astronauta.centroElementox,astronauta.centroElementoy,meteoritos[i].centroElementox,meteoritos[i].centroElementoy) <= (100*(canvasWidth/1420))/escalaastro))||
			(		(distancia(astronauta.centroElementox1,astronauta.centroElementoy1,meteoritos[i].centroElementox,meteoritos[i].centroElementoy) <= (80*(canvasWidth/1420))/escalaastro))||
			(		(distancia(astronauta.centroElementox2,astronauta.centroElementoy2,meteoritos[i].centroElementox,meteoritos[i].centroElementoy) <= (70*(canvasWidth/1420))/escalaastro))){
				game_over();
			}
		}
		if(level >= 2){
			for(let i=0;i<ovnis.length;i++){
				if((	(distancia(astronauta.centroElementox,astronauta.centroElementoy,ovnis[i].centroElementox,ovnis[i].centroElementoy) <= (100*(canvasWidth/1420))/escalaastro))||
				(		(distancia(astronauta.centroElementox1,astronauta.centroElementoy1,ovnis[i].centroElementox,ovnis[i].centroElementoy) <= (80*(canvasWidth/1420))/escalaastro))||
				(		(distancia(astronauta.centroElementox2,astronauta.centroElementoy2,ovnis[i].centroElementox,ovnis[i].centroElementoy) <= (70*(canvasWidth/1420))/escalaastro))){
					game_over();
				}
			}
		}
	}
	
	
	//función que actualiza los centros de cada elemento para el cálculo de distancias
	
		
	//configuración de los controles
	document.addEventListener("keydown", teclas_pulsadas);
	document.addEventListener("keyup", paraAstronauta);
	
		//Controles del astronauta:
	function paraAstronauta(){
		movimientox = 0
		movimientoy = 0
	}
	function teclas_pulsadas(){
	
	//movimiento hacia arriba, tecla W
		if(event.keyCode == '87'){
				movimientoy = -velocidadAstronauta;
		}
	//movimiento hacia la derecha, tecla D
		if(event.keyCode == '68'){
				movimientox = velocidadAstronauta;
		}
	//movimiento hacia la izquierda, tecla D
		if(event.keyCode == '65'){
				movimientox = -velocidadAstronauta;
		}
	//movimiento hacia abajo, tecla S
		if(event.keyCode == '83'){
				movimientoy = velocidadAstronauta;
		}
	}
	
	//***SONIDO***
	function sound(src) {//Función constructora de sonido
	
    	this.sound = document.createElement("audio");
		this.sound.src = src;
    	this.sound.setAttribute("preload", "auto");
    	this.sound.setAttribute("controls", "none");
    	this.sound.style.display = "none";
    	document.body.appendChild(this.sound);
			
    	this.play = function(){
        	this.sound.play();
		}
    	this.stop = function(){
        	this.sound.pause();
    	}
	}
	

	function videoplay(video, audio) {
		video.play();
		audio.play();
	} 
	
	//Cada vez que llamo a la funcion drawvideo es cada vez que el video dispara un evento play cuando se está reproduciendo:
	
	video1.addEventListener('play',function() {
		drawvideoIntroSkip(video1,ctx,canvasWidth, canvasHeight);
	});
	
	video2.addEventListener('play',function() {
		drawvideo(video2,ctx,canvasWidth, canvasHeight);
	});
	
	video3.addEventListener('play',function() {
		drawvideoIntroSkip(video3,ctx,canvasWidth, canvasHeight);
	});
	
	videocharacter.addEventListener('play',function() {
		drawvideoCharacter(videocharacter,ctx,canvasWidth, canvasHeight);
	});
	
	problem_vid.addEventListener('play',function() {
		drawvideoIntroSkip(problem_vid,ctx,canvasWidth, canvasHeight);
	});
	
	expl_vid.addEventListener('play',function() {
		drawvideoIntroSkip(expl_vid,ctx,canvasWidth, canvasHeight);
	});
	
	level1_vid.addEventListener('play',function() {
		drawvideo(level1_vid,ctx,canvasWidth, canvasHeight);
	});
	
	level2_vid.addEventListener('play',function() {
		drawvideo(level2_vid,ctx,canvasWidth, canvasHeight);
	});
	
	level3_vid.addEventListener('play',function() {
		drawvideo(level3_vid,ctx,canvasWidth, canvasHeight);
	});
	
	//Para que no se superponga el video con el juego le impongo la condición que deje de dibujarse cuando finaliza el video:
	function drawvideoIntroSkip(video, c, w, h){
		if(video.ended == false){
			c.drawImage(video,0,0, w, h);
			saltarIntro(video,c)
			setTimeout(drawvideoIntroSkip,20,video,c,canvasWidth,canvasHeight);
		}
	}
	function drawvideo(video, c, w, h){
		if(video.ended == false){
			c.drawImage(video,0,0, w, h);
			setTimeout(drawvideoIntroSkip,20,video,c,canvasWidth,canvasHeight);
		}
	}
	function drawvideoCharacter(video, c, w, h){
		if(chosen_character == false){
			c.drawImage(video,0,0, w, h);
			c.drawImage(trajenaranja,naranjabuttcoordx,naranjabuttcoordy,trajewidth_naranja,trajeheight_naranja)
			c.drawImage(trajeverde,verdebuttcoordx,verdebuttcoordy,trajewidth_verde,trajeheight_verde)
			pixels = 80*(canvasWidth/1420)
			c.font = pixels.toString()+"px FuenteNasa";
			c.fillStyle = "white";
			c.textAlign = "center";
			c.fillText("SELECT", w/2, (h/2)-(50*(canvasWidth/1420)));
			c.fillText("YOUR SUIT", w/2, (h/2)+(50*(canvasWidth/1420)));
			c.fillText("-SPACEJUMP-", w/2, (h/2)+(200*(canvasWidth/1420)));
			if(video.ended == true){
				video.currentTime = 0
				video.play()
			}
			
			setTimeout(drawvideoCharacter,20,video,c,canvasWidth,canvasHeight);
		}
	}	
	
		/****AQUÍ COMIENZA EL FLOW DEL JUEGO:****/
		
		
	//Función escuchadora que inicia el juego al pulsar la barra espaciadora:
	ctx.drawImage(start_im,0,0,canvasWidth,canvasHeight)
	
	document.addEventListener('keypress',startgameflow)
	
	function startgameflow(){
		if(event.keyCode == '32'){
			intro = false;
			ctx.clearRect(0, 0, canvasWidth, canvasHeight)
			document.removeEventListener("keypress", startgameflow);
			videoplay(video1, video1Sound)
		}
	}
	//cada vez que se acaba un vídeo en el flujo del juego llama al siguiente o al juego en si
	video1.onended = function() {	
			problem_vid.play()
	}
	
	problem_vid.onended = function() {
		video1.currentTime = 0
		video1.pause();
		
		button = 3
		document.addEventListener("click", buttonclick);
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		videocharacter.play()
	}
	
	videocharacter.onended = function() {
		if(chosen_character == true){
			videoexplicacion.play();
		}
	};
	expl_vid.onended = function() {
		level1_vid.play()
	};
	
	level1_vid.onended = function() {
		startgame(f_aparicion_met,numerodemet,vel_max_meteo); //level 1
	};
	
	video2.onended = function() {
		level2_vid.play()
	};
	
	level2_vid.onended = function() {
		startgame(f_aparicion_met,numerodemet,vel_max_meteo); //level 2
	};
	video3.onended = function() {
		level3_vid.play()
	};
	
	level3_vid.onended = function() {
		startgame(f_aparicion_met,numerodemet,vel_max_meteo); //level 3
	};	
}

