import {renderDom} from './react-dom'
let nextUnitOfWork = null;
let rootFiber = null;

// 创建 rootFiber 作为首个 nextUnitOfWork
export function createRoot(element, container) {
  rootFiber = {
    stateNode: container, // 记录对应的真实 dom 节点
    element: {
      // 挂载 element
      props: { children: [element] },
    },
  };
  nextUnitOfWork = rootFiber;
}

// 执行当前工作单元并设置下一个要执行的工作单元
function performUnitOfWork(workInProgress) {
  if (!workInProgress.stateNode) {
    // 若当前 fiber 没有 stateNode，则根据 fiber 挂载的 element 的属性创建
    workInProgress.stateNode = renderDom(workInProgress.element);
  }
  if (workInProgress.return && workInProgress.stateNode) {
    // 如果 fiber 有父 fiber且有 dom
    // 向上寻找能挂载 dom 的节点进行 dom 挂载
    let parentFiber = workInProgress.return;
    while (!parentFiber.stateNode) {
      parentFiber = parentFiber.return;
    }
    parentFiber.stateNode.appendChild(workInProgress.stateNode);
  }

  let children = workInProgress.element?.props?.children;
  let type = workInProgress.element?.type;

  if(typeof type === 'function'){
    if(type.prototype.isReactComponent){
      const {props, type: Comp} = workInProgress.element;
      const component = new Comp(props);
      const jsx = component.render();
      children = [jsx];
    }else{
      const {props, type: Fn} = workInProgress.element;
      const jsx = Fn(props);
      children = [jsx];
    }
  }

  if(children || children === 0){
    let elements = Array.isArray(children) ? children : [children];
    elements = elements.flat();

    let index = 0;
    let prevSibling = null;

    while(index < elements.length){
      const element = elements[index];
      const newFiber = {
        element,
        return: workInProgress,
        stateNode: null
      };
      if(index === 0){
        workInProgress.child = newFiber
      }else {
        prevSibling.sibling = newFiber
      }
      prevSibling = newFiber;
      index++;
    }
  }

  if(workInProgress.child){
    nextUnitOfWork = workInProgress.child;
  }else{
    let nextFiber = workInProgress;
    while(nextFiber){
      if(nextFiber.sibling){
        nextUnitOfWork = nextFiber.sibling
      }else{
        nextFiber = nextFiber.return;
      }
    }
    if(!nextFiber){
      nextUnitOfWork = null;
    }
  }
}