const rolePermissions = () => {
  return [
    {
      name: 'Admin',
      permissions: ['user.read'],
    },
    {
      name: 'SuperAdmin',
      permissions: ['user.update'],
    },
    {
      name: 'Owner',
      permissions: ['user.create', 'user.read', 'user.update','user.read.single'],
    },
  ];
};
export default rolePermissions();
