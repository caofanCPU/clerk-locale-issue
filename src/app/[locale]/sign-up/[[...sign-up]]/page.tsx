/**
 * @license
 * MIT License
 * Copyright (c) 2025 D8ger
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import { Header } from '@/components/header';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="flex-1 flex justify-center mt-10">
        <SignUp />
      </div>
    </div>
  
  );
}