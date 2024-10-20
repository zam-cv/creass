import React from 'react';
import Tree from 'react-d3-tree';

type TreeNode = {
  name: string;
  children?: TreeNode[];
};

const TreeComponent: React.FC = () => {
  // Definir los datos del árbol
  const treeData: TreeNode[] = [
    {
      name: "Root",
      children: [
        {
          name: "Child 1",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
          ],
        },
        {
          name: "Child 2",
          children: [
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
          ],
        },
      ],
    },
  ];

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h3>Tu camino</h3>
      <Tree
        data={treeData} // Los datos del árbol
        orientation="vertical" // Orientación del árbol (puede ser "vertical" o "horizontal")
        translate={{ x: 200, y: 50 }} // Posición del árbol en el área
        pathFunc="straight"
        collapsible = {true}
        dimensions={undefined}
        draggable ={true}
         // Estilo de las líneas de conexión (puede ser "diagonal", "elbow", etc.)
      />
    </div>
  );
};

export default TreeComponent;
