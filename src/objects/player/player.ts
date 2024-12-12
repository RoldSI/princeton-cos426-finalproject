import {Group, PerspectiveCamera, AudioListener, Object3D, Vector3, Raycaster, AnimationMixer , AnimationAction } from 'three';
import BasicFlashlight from '../../lights/basicFlashlight';
import { connectivity, globalState } from '../../app';

import MODEL from './player_model/model4.gltf?url';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Player extends Group {

    camera: PerspectiveCamera;
    head: Object3D;
    audioListener: AudioListener;
    score: number;
    previousScore: number;
    publicScore: number;
    lastUpdate: number = 0;
    flashlight: BasicFlashlight;
    animationMixer: AnimationMixer | undefined; 
    actions : { [key: string]: THREE.AnimationAction };
    activeAction : AnimationAction | undefined; //used for the actual animation
    currentAnimation : string; 

    

    constructor(_xPosition: number = 0, _zPosition: number = 0) {
        super();
        
        this.currentAnimation = "Idle";
        const loader = new GLTFLoader();
        this.actions = {};
        this.activeAction = undefined;

        const flashlight = new BasicFlashlight();
        this.flashlight = flashlight;
        this.flashlight.position.set(-2.2, 6.5, 2.8);
        this.flashlight.rotation.set(0, Math.PI, 0);

        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            const lanternaCylinder = model.children[0] // Idle
                .children[1] // spine_001
                .children[0] // spine_002
                .children[0] // spine_003
                .children[1] // shoulder_R
                .children[0] // arm_R_upper
                .children[0] // arm_R_lower
                .children[0] // hand_R
                .children[0] // finger1_R
                .children[0] // finger1_R_001
                .children[1];
            lanternaCylinder.add(this.flashlight);
            model.scale.set(0.12,0.12,0.12); // adjusting size/rotation as needed (size might) 
            model.rotation.y = Math.PI*33/32;       
              
            this.add(model);

            this.animationMixer = new AnimationMixer(model);
            this.animationMixer.timeScale = 1.5;
            this.animations = gltf.animations;

            this.actions['Idle'] = this.animationMixer.clipAction(gltf.animations.find((clip) => clip.name === 'Idle')!);
            this.actions['WalkForward'] = this.animationMixer.clipAction(gltf.animations.find((clip) => clip.name === 'WalkForward')!);
            this.actions['WalkLeft'] = this.animationMixer.clipAction(gltf.animations.find((clip) => clip.name === 'WalkLeft')!);
            this.actions['WalkRight'] = this.animationMixer.clipAction(gltf.animations.find((clip) => clip.name === 'WalkRight')!);
            this.actions['WalkBack'] = this.animationMixer.clipAction(gltf.animations.find((clip) => clip.name === 'WalkBack')!);

            this.activeAction = this.actions['Idle'];
            this.activeAction.play();
        });

       

        this.head = new Object3D();
        this.head.rotation.order = 'YXZ';
        

        this.head.position.set(0, 1.8, -0.5); // 054 prevents you from looking inside the char when looking down
                                              // Downside being the camera is not really where the head is however imo it feels natural
        this.add(this.head);

        this.camera = new PerspectiveCamera();
        this.head.add(this.camera);

        this.audioListener = new AudioListener();
        this.camera.add(this.audioListener);

        this.score = 0;
        this.previousScore = this.score;
        this.publicScore = this.score;
    }

    toJSON(): any {
        return {
            position: this.getPosition(),
            orientation: this.getOrientation(),
            score: this.score,
            publicScore: this.publicScore,
            currentAnimation : this.currentAnimation
        };
    }

    static fromJSON(json: any): Player {
        const player = new Player();
        player.updateFromJSON(json);
        return player;
    }

    updateFromJSON(json: any): void {
        this.setPosition(json.position.x, json.position.z);
        this.setOrientation(json.orientation.x, json.orientation.y);
        this.score = json.score;
        this.publicScore = json.publicScore;
        this.currentAnimation = json.currentAnimation;
        
    }

    sendPlayerData(timeStamp: number): void {
        const interval = 100;
        if (timeStamp - this.lastUpdate > interval) {
            connectivity.sendData({
                type: 'player',
                content: this.toJSON()
            });
        }
    }

    updateScore(_timeStamp: number): void {
        const sourcePosition = new Vector3();
        this.head.getWorldPosition(sourcePosition);

        const targetPosition = new Vector3();
        globalState.gamePlay!.player_other.head.getWorldPosition(targetPosition);

        const distance = sourcePosition.distanceTo(targetPosition);

        if (distance > this.flashlight.getDistance())
            return;

        const direction = new Vector3().subVectors(targetPosition, sourcePosition).normalize();

        const localizedDirection = direction.clone();
        localizedDirection.add(sourcePosition);
        this.head.worldToLocal(localizedDirection);
        localizedDirection.normalize();
        if(!this.flashlight.isAligned(localizedDirection))
            return;

        const raycaster = new Raycaster();
        raycaster.set(sourcePosition, direction);
        raycaster.far = distance;
        raycaster.near = 0.1;

        const intersections = raycaster.intersectObjects(globalState.scene!.world.children, true);
        if(intersections.length > 0)
            return;

        this.score += 1;
    }

    updatePublicScore(_timeStamp: number): void {
        if (this.previousScore == this.score) {
            this.publicScore = this.score;
        }
        this.previousScore = this.score;
    }


    update(timeStamp: number): void {
        this.sendPlayerData(timeStamp);
        this.updateScore(timeStamp);
        this.updatePublicScore(timeStamp);
    }

    getPosition(): { x: number; y: number; z: number } {
        return {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z
        };
    }

    modifyPosition(direction: Vector3): void {
        this.setPosition(this.position.x + direction.x, this.position.z + direction.z);
    }

    setPosition(x: number, z: number): void {
        const halfSize = globalState.scene!.getHalfSize();
        const x_restircted = Math.max(-halfSize, Math.min(halfSize, x));
        const z_restircted = Math.max(-halfSize, Math.min(halfSize, z));
        this.position.set(x_restircted, globalState.scene!.getHeight(x_restircted, z_restircted), z_restircted);
    }

    getOrientation(): { x: number; y: number } {
        return {
            x: this.head.rotation.x,
            y: this.rotation.y
        };
    }

    modifyOrientation(x: number, y: number): void {
        this.rotation.y += y;
        this.head.rotation.x += x;
        this.head.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.head.rotation.x))
    }

    setOrientation(x: number, y: number): void {
        this.rotation.y = y;
        this.head.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, x))
    }

    updateAnimation(duration: number = 0.2): void {
        if (this.animationMixer == undefined || this.activeAction == undefined) {
          return
        }
        const newAction = this.actions[this.currentAnimation];
        if(this.currentAnimation == "Idle" || this.currentAnimation == "WalkForward" || this.currentAnimation == "WalkBack") {
            this.animationMixer.timeScale = 1.7;
        } else {
            this.animationMixer.timeScale = 3.5;
        }
        // If the new action is different from the current one, fade to it
        if (newAction && newAction !== this.activeAction) {
          if (this.activeAction) {
            newAction.reset().play();
            this.activeAction.crossFadeTo(newAction, duration, true);
          }
          this.activeAction = newAction;  // Update the activeAction
        }
      }
}

export default Player;
