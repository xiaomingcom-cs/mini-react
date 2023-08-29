import {updateAttributes} from './react-dom'
import { getDeletions } from './fiber';
export function commitRoot(workInProgressRoot){
    const deletions = getDeletions();
    deletions.forEach(commitWork);
    commitWork(workInProgressRoot.child);
}

function commitWork(fiber){
    if(!fiber) {
        return;
    }
    let parentDom = fiber.return.stateNode;
    if(fiber.flag === 'Deletion'){
        if(typeof fiber.element?.type !== 'function'){
            parentDom.removeChild(fiber.stateNode);
        }
        return;
    }
    commitWork(fiber.child);
    if(fiber.flag === 'Placement'){
        const targetPositionDom = parentDom.childNodes[fiber.index];
        if(targetPositionDom){
            parentDom.insertBefore(fiber.stateNode,targetPositionDom);
        }else{
            parentDom.appendChild(fiber.stateNode);
        }
    }else if(fiber.flag === 'Update'){
        const {children, ...newAttributes} = fiber.element.props;
        const oldAttributes = Object.assign({},fiber.alternate.element.props);
        delete oldAttributes.children;
        updateAttributes(fiber.stateNode, newAttributes, oldAttributes)
    }
    
    commitWork(fiber.sibling)
}