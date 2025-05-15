/**
 * @license
 * MIT License
 * Copyright (c) 2025 D8ger
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import { SignIn } from '@clerk/nextjs';
import { Header } from '@/components/header';
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="flex-1 flex justify-center mt-10">
        <SignIn />
      </div>
    </div>
  );
}