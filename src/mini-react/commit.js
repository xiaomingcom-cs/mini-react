export function commitRoot(rootFiber){
    commitWork(rootFiber.child);
}

function commitWork(fiber){
    if(!fiber) {
        return;
    }
    commitWork(fiber.child);
    let parentDom = fiber.return.stateNode;
    parentDom.appendChild(fiber.stateNode);
    commitWork(fiber.sibling)
}