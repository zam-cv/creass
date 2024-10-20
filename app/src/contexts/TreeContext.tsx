import { createContext, useState, useContext } from "react";

interface Node {
  id: number;
  context: string;
  children: Node[];
}

interface Tree {
  children: Node[];
}

interface TreeContext {
  navigate: (id: number) => void;
  push: (node: Node) => void;
  tree: Tree;
  currentNode: Node;
}

const TreeContext = createContext<TreeContext | undefined>(undefined);

export default function TreeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentNode, setCurrentNode] = useState<Node>({
    id: 0,
    context: "Root",
    children: [],
  });

  const [tree, setTree] = useState<Tree>({
    children: [currentNode],
  });

  function push(node: Node) {
    const updatedChildren = [...currentNode.children, node];
    const updatedCurrentNode = { ...currentNode, children: updatedChildren };

    const updatedTree = updateTree(tree, updatedCurrentNode);

    setCurrentNode(updatedCurrentNode);
    setTree(updatedTree);
  }

  function updateTree(tree: Tree, updatedNode: Node): Tree {
    const updatedChildren = tree.children.map((child) =>
      child.id === updatedNode.id ? updatedNode : child
    );
    return { ...tree, children: updatedChildren };
  }

  function navigate(id: number, children: Node[]) {
    for (let i = 0; i < children.length; i++) {
      if (children[i].id === id) {
        setCurrentNode(children[i]);
        return;
      } else if (children[i].children.length > 0) {
        navigate(id, children[i].children);
      }
    }
  }

  return (
    <TreeContext.Provider
      value={{
        navigate: (id: number) => navigate(id, tree.children),
        push,
        tree,
        currentNode,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export function useTree() {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
}
