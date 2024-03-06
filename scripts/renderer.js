import * as CG from './transforms.js';
import { Matrix } from "./matrix.js";

class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        this.models = {
            slide0: [
                {
                    vertices: [
                        CG.Vector3(100, 0, 1),
                        CG.Vector3(98, 20, 1),
                        CG.Vector3(92, 38, 1),
                        CG.Vector3(83, 56, 1),
                        CG.Vector3(71, 71, 1),
                        CG.Vector3(56, 83, 1),
                        CG.Vector3(38, 92, 1),
                        CG.Vector3(20, 98, 1),
                        CG.Vector3(0, 100, 1),
                        CG.Vector3(-20, 98, 1),
                        CG.Vector3(-38, 92, 1),
                        CG.Vector3(-56, 83, 1),
                        CG.Vector3(-71, 71, 1),
                        CG.Vector3(-83, 56, 1),
                        CG.Vector3(-92, 38, 1),
                        CG.Vector3(-98, 20, 1),
                        CG.Vector3(-100, 0, 1),
                        CG.Vector3(-98, -20, 1),
                        CG.Vector3(-92, -38, 1),
                        CG.Vector3(-83, -56, 1),
                        CG.Vector3(-71, -71, 1),
                        CG.Vector3(-56, -83, 1),
                        CG.Vector3(-38, -92, 1),
                        CG.Vector3(-20, -98, 1),
                        CG.Vector3(0, -100, 1),
                        CG.Vector3(20, -98, 1),
                        CG.Vector3(38, -92, 1),
                        CG.Vector3(56, -83, 1),
                        CG.Vector3(71, -71, 1),
                        CG.Vector3(83, -56, 1),
                        CG.Vector3(92, -38, 1),
                        CG.Vector3(98, -20, 1)
                    ],
                    transform: [null],
                    distance: [0, 0], // distance X, distance Y
                    direction: [-1, -1] // direction X, direction Y
                }
            ],
            slide1: [
                {
                    vertices: [
                        CG.Vector3(100, 200, 1),
                        CG.Vector3(-100, 200, 1),
                        CG.Vector3(-200, 0, 1),
                        CG.Vector3(-100, -200, 1),
                        CG.Vector3(100, -200, 1),
                        CG.Vector3(200, 0, 1),
                    ],
                    transform: [null],
                    currentTheta: 0
                }
            ],
            slide2: [],
            slide3: []
        };
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }
    
    // Switches to a specific transorm case
    updateTransforms(time, delta_time) {
        //console.log(time);
        //console.log(delta_time);
        switch (this.slide_idx) {
            case 0:
                this.bouncingBallTransforms(delta_time, 3);
                break;
            case 1:
                this.spinningPolygonTransforms(delta_time, 0.5);
                break;
            case 2:
                
                break;
            case 3:
                
                break;
        }
    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }


    /*
    ANNIMATION METHODS
    */
    // Completes caluclations and transforms for bouncing ball using delta_time
    bouncingBallTransforms(delta_time, speed){
        // calcualte distance, direction, and speed for Y
        let distanceY = this.models.slide0[0].distance[1];
        let directionY = this.models.slide0[0].direction[1];
        let velocityY = directionY * 350 / speed / 1000;
        let transY = distanceY + (velocityY * delta_time);

        // calcualte distance, direction, and speed for X
        let distanceX = this.models.slide0[0].distance[0];
        let directionX = this.models.slide0[0].direction[0];
        let velocityX = directionX * 350 / speed / 1000;        
        let transX = distanceX + (velocityX * delta_time);

        // set Y direction if out of bounds
        if (transY < -350 && directionY == -1) {
            this.models.slide0[0].direction[1] = 1;
            velocityY *= -1;
            transY = distanceY + (velocityY * delta_time);
        } else if (transY > 50 && directionY == 1) {
            this.models.slide0[0].direction[1] = -1;
            velocityY *= -1;
            transY = distanceY + (velocityY * delta_time);
        }

        // set X direction if out of bounds
        if (transX < -300 && directionX == -1) {
            this.models.slide0[0].direction[0] = 1;
            velocityX *= -1;
            transX = distanceX + (velocityX * delta_time);
        } else if (transX > 300 && directionX == 1) {
            this.models.slide0[0].direction[0] = -1;
            velocityX *= -1;
            transX = distanceX + (velocityX * delta_time);
        }

        // translate model to world view
        this.translate(this.models.slide0[0].vertices, 400 + transX, 450 + transY, this.models.slide0[0].transform);

        // update distance traveled
        this.models.slide0[0].distance[1] = transY;
        this.models.slide0[0].distance[0] = transX;
    }
    
    spinningPolygonTransforms(delta_time, velocity) {
        // velocity in revlotuions per second
        let rotateTheta = Math.PI * 2 * velocity / 1000;
        let currentTheta = this.models.slide1[0].currentTheta + (rotateTheta * delta_time);
        this.rotate(this.models.slide1[0].vertices, currentTheta, this.models.slide1[0].transform);
        this.translate(this.models.slide1[0].transform, 300, 300, this.models.slide1[0].transform);
        this.models.slide1[0].currentTheta = currentTheta;
    }

    /*
    TRANSFORM METHDODS
    */
    // Translates a model view using X and Y cordinates and updates the inputed world view
    translate(modelView, transX, transY, worldView) {
        let matrix = new Matrix(3, 3);
        CG.mat3x3Translate(matrix, transX, transY);
        for (let i = 0; i < modelView.length; i++) {
            let newMatrix = Matrix.multiply([matrix, modelView[i]]);
            worldView[i] = newMatrix;
        }
    }

    // translates a model view using theta and updates the inputed world view
    rotate(modelView, theta, worldView) {
        let matrix = new Matrix(3,3);
        CG.mat3x3Rotate(matrix, theta);
        for (let i = 0; i < modelView.length; i++) {
            let newMatrix = Matrix.multiply([matrix, modelView[i]]);
            worldView[i] = newMatrix;
        }
    }

    /*
    DRAWING METHODS
    */
    // Bouncing ball slide
    drawSlide0() {
        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(this.models.slide0[0].transform, teal);
    }

    //
    drawSlide1() {
        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(this.models.slide1[0].transform, teal);
        
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions


    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};

export { Renderer };
