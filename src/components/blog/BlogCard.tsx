import { BlogLight } from "@/util/types/blog";
import React from "react";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { PinIcon } from "lucide-react-native";

export default function BlogCard( {blog}: {blog: BlogLight}) {
  return (
    <Card className="p-4 mt-1 mb-1">
      <Box className="flex-row justify-between items-center mb-2">
        <Heading size="md" className="flex-1">
          {blog.title}
        </Heading>
        {blog.isPinned && (
          <Badge variant="solid" action="info" className="ml-2 rounded-lg">
            <PinIcon size={16} />
          </Badge>
        )}
      </Box>
      <Text className="text-gray-600">{blog.excerpt}</Text>
      {blog.tags && blog.tags.length > 0 && (
        <Box className="flex-row flex-wrap mt-3">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="outline" action="warning" className="mr-2 rounded-lg">
              <Text className="text-sm">{tag}</Text>
            </Badge>
          ))}
        </Box>
      )}
    </Card>
  );
}