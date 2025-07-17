import mongoose from 'mongoose';
import { PermissionSchema } from './permission.schema';
import { PERMISSIONS } from './seed-permissions';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://pdanhkhoa2509:DcaPeEpYtGgQW9vn@cluster0.q1qzjnv.mongodb.net/todolistapp';

async function seedPermissions() {
  await mongoose.connect(MONGO_URI);
  const Permission = mongoose.model('Permission', PermissionSchema);
  for (const perm of PERMISSIONS) {
    const exists = await Permission.findOne({ name: perm.name });
    if (!exists) {
      await Permission.create(perm);
      console.log('Seeded permission:', perm.name);
    } else {
      console.log('Permission exists:', perm.name);
    }
  }
  await mongoose.disconnect();
  console.log('Permission seeding done.');
}

seedPermissions().catch(console.error); 