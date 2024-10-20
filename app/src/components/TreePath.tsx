import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";

type TreeNode = {
  name: string;
  children?: TreeNode[];
};

const TreeComponent: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    const storedTree = localStorage.getItem("tree");
    if (storedTree) {
      const parsedTree = JSON.parse(storedTree);
      console.log("Árbol cargado:", parsedTree); // Aquí ves el árbol que estás cargando
      const formattedTreeData = {
        name: parsedTree.context,
        children: parsedTree.children.map((child: any) => ({
          name: child.context,
          children: child.children,
        })),
      };
      setTreeData([formattedTreeData]);
    }
  }, []);

  useEffect(() => {
    // Obtener el árbol guardado en localStorage para el proyecto seleccionado
    const storedProject = localStorage.getItem("selectedProject");
    const storedTree = localStorage.getItem("treeData");

    if (storedProject && storedTree) {
      const parsedTree = JSON.parse(storedTree);
      // Encontrar el árbol asociado al proyecto actual
      const projectTree = parsedTree.find(
        (tree: { name: string }) => tree.name === storedProject
      );
      if (projectTree) {
        setTreeData([projectTree]);
      }
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <h3>Tu camino</h3>
      {treeData.length > 0 ? (
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 200, y: 50 }}
          pathFunc="straight"
          collapsible={true}
          dimensions={undefined}
          draggable={true}
        />
      ) : (
        <p>No hay árbol disponible para este proyecto.</p>
      )}
    </div>
  );
};

export default TreeComponent;
