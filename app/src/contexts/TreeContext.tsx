import { createContext, useState, useContext } from 'react';

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
}

const TreeContext = createContext<TreeContext | undefined>(undefined);

export default function TreeProvider({ children }: { children: React.ReactNode }) {
    const [currentTree, setCurrentTree] = useState<Node>({
        id: 0,
        context: 'Root',
        children: [],
    });

    const [tree, setTree] = useState<Tree>({
        children: [],
    });

    function push(node: Node) {
        currentTree.children.push(node);
        setTree(tree);
    }

    function navigate(id: number, children: Node[]) {
        for (let i = 0; i < children.length; i++) {
            if (children[i].id === id) {
                setTree({
                    children: children,
                });
                setCurrentTree(children[i]);
                break;
            } else {
                navigate(id, children[i].children);
            }
        }
    }

    return (
        <TreeContext.Provider value={
            {
                navigate: (id: number) => navigate(id, tree.children),
                push,
                tree,
            }
        }>
            {children}
        </TreeContext.Provider>
    );
}

export function useTree() {
    const context = useContext(TreeContext);
    if (context === undefined) {
        throw new Error('useTree must be used within a TreeProvider');
    }
    return context;
}