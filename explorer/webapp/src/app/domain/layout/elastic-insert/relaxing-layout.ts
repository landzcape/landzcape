import {Landscape} from '../../model/landscape';
import {LandscapeContainerMapper} from './landscape-container-mapper';
import {Container} from './container';
import {ContainerLayout} from './container-layout';
import {Component} from '../../model/component';
import {DirectedForce} from '../shared/directed-force';
import {Direction} from '../../common/direction';
import {ForceDelta} from './force-delta';
import {Position} from '../../common/position';

export class RelaxingLayout {
  static readonly MAX_ZERO = 100;

  readonly container: Container;
  readonly containerLayout: ContainerLayout;
  zeroSteps = 0;
  candidateDepth = 1;
  candidateIndex = 0;
  force = Number.MAX_VALUE;

  constructor(landscape: Landscape) {
    const layers = LandscapeContainerMapper.fromLayers(landscape.layers);
    this.container = LandscapeContainerMapper.fromLandscape(landscape, layers);
    this.containerLayout = new ContainerLayout(this.container, layers);
  }

  public relaxStep(): boolean {
    if (this.zeroSteps >= RelaxingLayout.MAX_ZERO) {
      if (this.candidateDepth === 3) {
        console.log(`finished relaxing - the force is ${this.force}`);
        return true;
      }
      this.candidateDepth++;
      this.candidateIndex = 0;
      this.zeroSteps = 0;
    } else {
      this.candidateIndex++;
    }
    const candidate = this.getCandidate(this.container, this.candidateDepth, this.candidateIndex);
    if (candidate === undefined) {
      return true;
    }
    const relaxation = this.doRelaxation(candidate, this.candidateDepth);
    this.force = relaxation.force;
    if (relaxation.delta === 0) {
      this.zeroSteps++;
    } else if (isNaN(relaxation.force)) {
      throw new Error(`Relaxation force is NaN for ${candidate.value.id.name}`);
    } else {
      // console.log(`relaxed from ${relaxation.force + relaxation.delta} to ${relaxation.force} in ${this.zeroSteps} steps`);
      this.zeroSteps = 0;
    }
    return false;
  }

  public relax(): void {
    while (!this.relaxStep()) {}
  }

  getPositions(depth?: number): Map<Component, Position> {
    const useDepth = depth === undefined ? this.candidateDepth : depth;
    const positions = this.containerLayout.getPositions(useDepth);
    const result = new Map<Component, Position>();
    positions.forEach((position, container) => {
      return result.set(container.value, position);
    });
    return result;
  }

  private doRelaxation(container: Container, relaxDepth: number): ForceDelta {
    const positions = this.getPositions(relaxDepth);
    const currentForce = this.getForce(positions);
    container.moveRight();
    const rightPosition = this.getPositions(relaxDepth);
    const rightForce = this.getForce(rightPosition);
    const rightRelaxation = currentForce - rightForce;
    container.moveLeft();
    container.moveLeft();
    const leftPosition = this.getPositions(relaxDepth);
    const leftForce = this.getForce(leftPosition);
    const leftRelaxation = currentForce - leftForce;
    const direction = this.getDirection(leftRelaxation, rightRelaxation);
    // console.log(container.value.name, rightForce, leftForce, currentForce);
    if (direction === Direction.RIGHT) {
      container.moveRight();
      container.moveRight();
      return {
        force: rightForce,
        delta: rightRelaxation
      };
    } else if (direction === Direction.STAY) {
      container.moveRight();
      return {
        force: currentForce,
        delta: 0
      };
    } else {
      return {
        force: leftForce,
        delta: leftRelaxation
      };
    }
  }

  private getDirection(leftRelaxation: number, rightRelaxation: number): Direction {
    if (leftRelaxation < 0) {
      if (rightRelaxation < 0) {
        return Direction.STAY;
      } else if (rightRelaxation === 0) {
        return Direction.STAY;
      } else {
        return Direction.STAY;
      }

    }
    if (leftRelaxation === 0) {
      if (rightRelaxation < 0) {
        return Direction.LEFT;
      } else if (rightRelaxation === 0) {
        return Direction.LEFT;
      } else {
        return Direction.RIGHT;
      }
    }
    if (leftRelaxation > 0) {
      if (rightRelaxation < 0) {
        return Direction.LEFT;
      } else if (rightRelaxation === 0) {
        return Direction.LEFT;
      } else {
        return Direction.LEFT;
      }
    }
  }

  private getForce(positions: Map<Component, Position>) {
    let force = 0;
    positions.forEach((position, module) => {
      module.getDependenciesIncludingInterfaces().forEach(dependency => {
        const dependencyPosition = positions.get(dependency);
        if (dependencyPosition) {
          const directedForce = DirectedForce.fromCenter(position, dependencyPosition);
          force += directedForce.getStrength();
        }
      });
    });
    return force;
  }

  private getCandidate(landscape: Container, candidateDepth: number, candidateCounter: number): Container {
    let children: Container[] = landscape.children;
    for (let i = 1; i < candidateDepth; i++) {
      children = children.map(child => child.children).reduce((a, b) => a.concat(b));
    }
    const index = candidateCounter % children.length;
    return children[index];
  }

}
