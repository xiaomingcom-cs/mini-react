import { deleteFiber } from "./fiber";
export function reconcileChildren(workInProgress, elements) {
    let index = 0;
    let prevSibling = null;
    let oldFiber = workInProgress?.alternate?.child;

    while (index < elements.length || oldFiber) {
        const element = elements[index];
        let newFiber = null;
        const isSameType =
            element?.type &&
            oldFiber?.element?.type &&
            element.type === oldFiber.element.type;
        if(isSameType){
            newFiber = {
                element: {
                    ...element,
                    props: element.props
                },
                stateNode: oldFiber.stateNode,
                return: workInProgress,
                alternate: oldFiber,
                flag: 'Update'
            };
        } else {
            if(element || element === 0){
                newFiber = {
                    element,
                    stateNode: null,
                    return: workInProgress,
                    alternate: null,
                    flag: 'Placement',
                    index,
                }
            }
            if(oldFiber){
                oldFiber.flag = 'Deletion';
                deleteFiber(oldFiber);
            }
        }
        if(oldFiber){
            oldFiber = oldFiber.sibling
        }
        if (index === 0) {
            workInProgress.child = newFiber;

        } else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber;
        index++;
    }
}