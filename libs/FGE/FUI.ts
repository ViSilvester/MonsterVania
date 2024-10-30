import { Engine } from "./engine.js";
import { Entity } from "./entity.js";
import { Vec2 } from "./geometry.js";

export class UiContainer {

    pos: Vec2;
    dim: Vec2;
    scrollDirection: ScrollDirection;
    children: Array<UiContainer | UiElement>

    constructor(pos: Vec2, dim: Vec2, scrollDirection: ScrollDirection, children: Array<UiContainer | UiElement>) {

        this.pos = pos;
        this.dim = dim;
        this.scrollDirection = scrollDirection;
        this.children = children;

    }

    makeAction() {
        for (var i = 0; i < this.children.length; i++) {
            var node = this.children[i];
            if (node instanceof UiElement) {

                if (node.isSelected && node.action instanceof Function) {
                    node.action.call(null);
                }
            }
        }
    }

    selectNextLeaf(): boolean {

        var foundActive = false;
        var firstelement: any;

        for (var i = 0; i < this.children.length; i++) {

            var node = this.children[i];

            //caso filho for subtree
            if (node instanceof UiContainer) {

                var r = node.selectNextLeaf();

                if (r) {
                    return r;
                }
            }
            // caso filho for elemento (caso do final de recursão)
            else {

                //guarda primeiro Uielement que encontrar
                if (!firstelement) {
                    firstelement = node;
                }

                // se node for ativo, marca como não ativo e indica que o proximo deverá ser ativado
                if (node.isSelected && !foundActive) {
                    foundActive = true;
                    node.isSelected = false;
                }
                // se node ativo ja foi encontrado esse deve ser o novo ativo
                if (foundActive) {
                    node.isSelected = true;
                    return true;
                }
            }
        }

        // se rodou a arvore toda e econtrou o ativo mas não encontrou um proximo elemento, ativa o primeiro elemento.
        if (foundActive && firstelement instanceof UiElement) {
            firstelement.isSelected = true;
        }

        return false;
    }

    selectNextSubTree(): number {

        var foundActive = false;
        var firstelement: any;

        for (var i = 0; i < this.children.length; i++) {

            var node = this.children[i];

            if (node instanceof UiContainer) {

                var r = node.selectNextSubTree();

                if (r == 1) {
                    return 2;
                }
                if (r == 2) {

                    var element = node.findFirstElement();
                    if (element instanceof UiElement) {
                        element.isSelected = true;
                    }
                    return 0;
                }
            }

            if (node instanceof UiElement) {

                if (node.isSelected) {
                    foundActive = true;
                    node.isSelected = false;
                    return 1;
                }
            }
        }

        return 0;

    }

    findFirstElement(): UiElement | undefined {

        for (var i = 0; i < this.children.length; i++) {

            var node = this.children[i];

            if (node instanceof UiContainer) {

                var element = node.findFirstElement();

                if (element instanceof UiElement) {
                    return element;
                }

            }
            else if (node instanceof UiElement) {
                return node;
            }
        }
    }



    render(rpos: Vec2, engine: Engine): Vec2 {

        var x = this.pos.x + rpos.x;
        var y = this.pos.y + rpos.y;

        this.dim = new Vec2(0, 0);

        for (var i = 0; i < this.children.length; i++) {

            var node = this.children[i];

            var d = node.render(new Vec2(x, y), engine);


            if (this.scrollDirection == ScrollDirection.horizontal) {
                this.dim.y = d.y;
                this.dim.x += d.x;
            }
            else {
                this.dim.x = d.x;
                this.dim.y += d.y;
            }

            if (this.scrollDirection == ScrollDirection.horizontal) {
                x += node.dim.x;
            }
            else {
                y += node.dim.y;
            }
        }

        return this.dim;
    }

    calcRenderPos() {
        return new Vec2(0, 0)
    }
}

export abstract class UiElement {

    pos: Vec2;
    dim: Vec2;
    isSelected: boolean;
    isVisible: boolean;
    father: UiContainer;
    action: Function | undefined;

    constructor(pos: Vec2, dim: Vec2, father: UiContainer) {

        this.pos = pos;
        this.dim = dim;
        this.father = father;
        this.isSelected = false;
        this.isVisible = false;

    }

    abstract render(rpos: Vec2, engine: Engine): Vec2;

    setAction(func: Function) {
        this.action = func;
    }


}

export enum ScrollDirection {
    vertical,
    horizontal
}