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
            slide2: [
                {
                    vertices: [
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(-100, 100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(100, -100, 1),
                    ],
                    transform: [null],
                    x_growing: true,
                    y_growing: true,
                    x_rate: .001,
                    y_rate: .001,
                    stretch_x: 1,
                    stretch_y: 1,
                },
                {
                    vertices: [
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(-100, 100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(100, -100, 1),
                    ],
                    transform: [null],
                    x_growing: true,
                    y_growing: true,
                    x_rate: .0005,
                    y_rate: .0015,
                    stretch_x: 1,
                    stretch_y: 1,
                },

            ],
            slide3: [
                {
                    vertices: [
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(-100, 100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(100, -100, 1),
                    ],
                    transform: [null],
                    distance: [0, 0], // distance X, distance Y
                    direction: [-1, -1], // direction X, direction Y
                    currentTheta: 0,
                    x_growing: true,
                    y_growing: true,
                    x_rate: .001,
                    y_rate: .002,
                    stretch_x: 1,
                    stretch_y: 1,
                },
            ]
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
                this.StretchPolygon(delta_time);
                break;
            case 3:
                let vert = this.models.slide3[0].vertices;
                this.spinningPolygonTransforms(delta_time, 0.5);
                this.models.slide3[0].vertices = this.models.slide3[0].transform;
                this.StretchPolygon(delta_time);
                this.translate(this.models.slide3[0].transform, 300*Math.sin(time/1000), 50*Math.sin(time/1000), this.models.slide3[0].transform);
                this.models.slide3[0].vertices = vert;
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
        let models = Object.values(this.models)[this.slide_idx];
        // calcualte distance, direction, and speed for Y
        let distanceY = models[0].distance[1];
        let directionY = models[0].direction[1];
        let velocityY = directionY * 350 / speed / 1000;
        let transY = distanceY + (velocityY * delta_time);

        // calcualte distance, direction, and speed for X
        let distanceX = models[0].distance[0];
        let directionX = models[0].direction[0];
        let velocityX = directionX * 350 / speed / 1000;        
        let transX = distanceX + (velocityX * delta_time);

        // set Y direction if out of bounds
        if (transY < -350 && directionY == -1) {
            models[0].direction[1] = 1;
            velocityY *= -1;
            transY = distanceY + (velocityY * delta_time);
        } else if (transY > 50 && directionY == 1) {
            models[0].direction[1] = -1;
            velocityY *= -1;
            transY = distanceY + (velocityY * delta_time);
        }

        // set X direction if out of bounds
        if (transX < -300 && directionX == -1) {
            models[0].direction[0] = 1;
            velocityX *= -1;
            transX = distanceX + (velocityX * delta_time);
        } else if (transX > 300 && directionX == 1) {
            models[0].direction[0] = -1;
            velocityX *= -1;
            transX = distanceX + (velocityX * delta_time);
        }

        // translate model to world view
        this.translate(models[0].vertices, 400 + transX, 450 + transY, models[0].transform);

        // update distance traveled
        models[0].distance[1] = transY;
        models[0].distance[0] = transX;
    }
    
    spinningPolygonTransforms(delta_time, velocity) {
        // velocity in revlotuions per second
        let models = Object.values(this.models)[this.slide_idx];
        let rotateTheta = Math.PI * 2 * velocity / 1000;
        let currentTheta = models[0].currentTheta + (rotateTheta * delta_time);
        this.rotate(models[0].vertices, currentTheta, models[0].transform);
        models[0].currentTheta = currentTheta;
    }

    StretchPolygon(delta_time) {
        let slide = this.slide_idx;
        let models = Object.values(this.models)[slide];
        for (let i = 0; i < models.length; i++) {
            let stretch_x = models[i].stretch_x;
            let stretch_y = models[i].stretch_y;
            this.Stretch(models[i].vertices, stretch_x, stretch_y, models[i].transform);
    
            if (stretch_x > 2) {
                models[i].x_growing = false;
            } else if (stretch_x < 0.5) {
                models[i].x_growing = true;
            }
    
            if (stretch_y > 2) {
                models[i].y_growing = false;
            } else if (stretch_y < 0.5) {
                models[i].y_growing = true;
            }
    
            models[i].stretch_x = stretch_x + (models[i].x_rate * delta_time * (models[i].x_growing - 0.5) * 2);
            models[i].stretch_y = stretch_y + (models[i].y_rate * delta_time * (models[i].y_growing - 0.5) * 2);
        }
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

    Stretch(modelView, size_x, size_y, worldView) {
        let mat = new Matrix(3, 3);
        CG.mat3x3Scale(mat, size_x, size_y);

        for (let i = 0; i < modelView.length; i++) {
            let new_mat = Matrix.multiply([mat, modelView[i]]);
            worldView[i] = new_mat;
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
        this.translate(this.models.slide1[0].transform, 300, 300, this.models.slide1[0].transform);
        this.drawConvexPolygon(this.models.slide1[0].transform, teal);
        
        
    }

    //
    drawSlide2() {
        let purple = [150, 50, 230, 255];
        let green = [50, 240, 130, 255];
        this.translate(this.models.slide2[0].transform, 200, 300, this.models.slide2[0].transform);
        this.translate(this.models.slide2[1].transform, 500, 300, this.models.slide2[1].transform);
        this.drawConvexPolygon(this.models.slide2[0].transform, purple);
        this.drawConvexPolygon(this.models.slide2[1].transform, green);
    }

    //
    drawSlide3() {
        let pastel = [119, 242, 152, 255];
        this.translate(this.models.slide3[0].transform, 300, 300, this.models.slide3[0].transform);
        this.drawConvexPolygon(this.models.slide3[0].transform, pastel);
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
