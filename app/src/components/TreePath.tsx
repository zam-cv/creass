// TreeComponent.tsx
import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { render } from "react-dom";

type TreeNode = {
  name: string;
  pageInfo?: { title: string; content: string }; // Información asociada al nodo
  children?: TreeNode[];
};

type TreeComponentProps = {
  onClose: () => void; // Prop para manejar el cierre del árbol
};

const TreeComponent: React.FC<TreeComponentProps> = ({ onClose }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedPage, setSelectedPage] = useState<{ title: string; content: string } | null>(null);

  const formatTreeData = (node: any): TreeNode => {
    return {
      name: node.context,
      pageInfo: node.pageInfo || { title: node.context, content: "Sin información adicional" },
      children: node.children?.map((child: any) => formatTreeData(child)) || [],
    };
  };

  useEffect(() => {
    const storedTree = localStorage.getItem("tree");
    if (storedTree) {
      const parsedTree = JSON.parse(storedTree);
      const formattedTreeData = formatTreeData(parsedTree);
      setTreeData([formattedTreeData]);
    }
  }, []);

  useEffect(() => {
    const storedProject = localStorage.getItem("selectedProject");
    const storedTree = localStorage.getItem("treeData");

    if (storedProject && storedTree) {
      const parsedTree = JSON.parse(storedTree);
      const projectTree = parsedTree.find((tree: { name: string }) => tree.name === storedProject);
      if (projectTree) {
        setTreeData([projectTree]);
      }
    }
  }, []);

  // Función para manejar el clic en un nodo
  const handleNodeClick = (nodeData: any) => {
    const pageInfo = nodeData.data.pageInfo;
    setSelectedPage(pageInfo); // Establecemos la página seleccionada
    onClose(); // Llama a la función de cierre
  };


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
          draggable={true}
          onNodeClick={handleNodeClick} 
          renderCustomNodeElement={(rd3tprops) => 
            renderCustomNode({...rd3tprops, handleNodeClick})
          }// Agregamos la función de clic en nodo
        />
      ) : (
        <p>No hay árbol disponible para este proyecto.</p>
      )}

      {/* Mostrar la información de la página seleccionada */}
      {selectedPage && (
        <div className="page-info">
          <h2>{selectedPage.title}</h2>
          <p>{selectedPage.content}</p>
        </div>
      )}
    </div>
  );
};
const renderCustomNode = ({ nodeDatum, handleNodeClick }: any) => (
  <g>
    <circle r="10" fill="#69b3a2" onClick={() => handleNodeClick({ data: nodeDatum })} />
    <text fill="black" strokeWidth="1" x="20">
      {nodeDatum.name}
    </text>
  </g>
);

export default TreeComponent;
